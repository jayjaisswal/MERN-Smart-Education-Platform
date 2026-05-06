import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  generateId,
  updateNodeInTree,
  renameInTree,
  updateLinkInTree,
  detectContentType,
} from "./courseUtils";
import {
  createFreeCourse,
  updateFreeCourse,
} from "../../../services/operations/freeCoursesAPI";

export const useFreeCourseManagement = () => {
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [courseStructure, setCourseStructure] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [editingLink, setEditingLink] = useState("");
  const [myCourses, setMyCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const token =
    localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : null;

  const mapStructureForBackend = (structure = []) => {
    // Backend expects items like { videoUrl, ... } (controller validates videoUrl if present)
    // UI uses { link, contentType }
    const mapNode = (node) => {
      if (!node) return node;

      if (node.type === "file") {
        return {
          ...node,
          videoUrl: node.link || "",
          // keep link too so UI remains consistent
        };
      }

      if (node.type === "folder") {
        return {
          ...node,
          children: Array.isArray(node.children)
            ? node.children.map(mapNode)
            : [],
        };
      }

      return node;
    };

    return Array.isArray(structure) ? structure.map(mapNode) : [];
  };

  // Load courses from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("freeCourses");
    if (saved) {
      setMyCourses(JSON.parse(saved));
    }
  }, []);


  // Toggle folder expansion
  const toggleFolder = (id) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFolders(newExpanded);
  };

  // Add new folder
  const addFolder = (parentId = null) => {
    const newFolder = {
      id: generateId(),
      name: "New Chapter",
      type: "folder",
      children: [],
      parentId,
    };

    if (!parentId) {
      setCourseStructure([...courseStructure, newFolder]);
    } else {
      updateNodeInTree(courseStructure, parentId, (node) => {
        node.children.push(newFolder);
      });
    }
    setExpandedFolders(new Set(expandedFolders).add(newFolder.id));
  };

  // Add new file/link
  const addFile = (parentId) => {
    const newFile = {
      id: generateId(),
      name: "New Resource",
      type: "file",
      link: "",
      contentType: "link",
      parentId,
    };

    updateNodeInTree(courseStructure, parentId, (node) => {
      if (!node.children) node.children = [];
      node.children.push(newFile);
    });

    setCourseStructure([...courseStructure]);
  };

  // Delete node
  const deleteNode = (id, parentId) => {
    if (!parentId) {
      setCourseStructure(courseStructure.filter((node) => node.id !== id));
    } else {
      updateNodeInTree(courseStructure, parentId, (node) => {
        node.children = node.children.filter((child) => child.id !== id);
      });
    }
    setCourseStructure([...courseStructure]);
  };

  // Rename node
  const renameNode = (id, newName) => {
    const updated = courseStructure.map((node) =>
      renameInTree(node, id, newName),
    );
    setCourseStructure(updated);
    setEditingNodeId(null);
  };

  // Update file link
  const updateFileLink = (id, link) => {
    const updated = courseStructure.map((node) =>
      updateLinkInTree(node, id, link),
    );
    setCourseStructure(updated);
  };

  // Save course (localStorage + backend)
  const saveCourse = async () => {
    if (!courseName.trim()) {
      toast.error("Please enter course name");
      return;
    }
    if (courseStructure.length === 0) {
      toast.error("Please add at least one chapter");
      return;
    }

    if (!token) {
      toast.error("Please login as Instructor/Admin first");
      return;
    }

    const backendPayload = {
      title: courseName,
      description: courseDescription,
      isPublic,
      structure: mapStructureForBackend(courseStructure),
    };

    try {
      // Sync with backend
      if (editingCourseId) {
        const response = await updateFreeCourse(
          editingCourseId,
          backendPayload,
          token,
        );

        if (!response?.success) {
          toast.error(response?.message || "Failed to update course");
          return;
        }

        const savedCourse = response?.data || response;
        const updated = myCourses.map((c) =>
          c.id === editingCourseId
            ? {
                ...c,
                // replace with backend fields for consistency
                id: savedCourse._id || editingCourseId,
                name: savedCourse.title || c.name,
                description: savedCourse.description ?? c.description,
                isPublic: savedCourse.isPublic ?? c.isPublic,
                structure:
                  savedCourse.structure || mapStructureForBackend(courseStructure),
                createdAt: savedCourse.createdAt || c.createdAt,
                updatedAt: savedCourse.updatedAt || new Date().toISOString(),
              }
            : c,
        );

        setMyCourses(updated);
        localStorage.setItem("freeCourses", JSON.stringify(updated));
        toast.success("Course updated successfully!");
      } else {
        const response = await createFreeCourse(backendPayload, token);

        if (!response?.success) {
          toast.error(response?.message || "Failed to create course");
          return;
        }

        const savedCourse = response?.data || response;
        const newCourseLocal = {
          id: savedCourse._id,
          name: savedCourse.title,
          description: savedCourse.description,
          isPublic: savedCourse.isPublic,
          structure: savedCourse.structure || mapStructureForBackend(courseStructure),
          createdAt: savedCourse.createdAt || new Date().toISOString(),
          updatedAt: savedCourse.updatedAt || new Date().toISOString(),
        };

        const updated = [...myCourses, newCourseLocal];
        setMyCourses(updated);
        localStorage.setItem("freeCourses", JSON.stringify(updated));
        toast.success("Course created successfully!");
      }

      // Reset form
      resetForm();
    } catch (err) {
      console.error("saveCourse error:", err);
      toast.error("Something went wrong while saving course");
    }
  };

  // Edit course
  const editCourse = (course) => {
    setCourseName(course.name);
    setCourseDescription(course.description);
    setIsPublic(course.isPublic);
    setCourseStructure(course.structure);
    setEditingCourseId(course.id);
    setSelectedCourse(course);
    setExpandedFolders(new Set());
  };

  // Delete course
  const deleteCourse = (courseId) => {
    const updated = myCourses.filter((c) => c.id !== courseId);
    setMyCourses(updated);
    localStorage.setItem("freeCourses", JSON.stringify(updated));
    if (selectedCourse?.id === courseId) {
      resetForm();
    }
    toast.success("Course deleted successfully!");
  };

  // Toggle course privacy
  const toggleCoursePrivacy = (courseId) => {
    const updated = myCourses.map((c) =>
      c.id === courseId ? { ...c, isPublic: !c.isPublic } : c,
    );
    setMyCourses(updated);
    localStorage.setItem("freeCourses", JSON.stringify(updated));
    if (selectedCourse?.id === courseId) {
      setSelectedCourse({
        ...selectedCourse,
        isPublic: !selectedCourse.isPublic,
      });
      setIsPublic(!isPublic);
    }
    toast.success(`Course is now ${!isPublic ? "public" : "private"}`);
  };

  // Reset form
  const resetForm = () => {
    setCourseName("");
    setCourseDescription("");
    setCourseStructure([]);
    setExpandedFolders(new Set());
    setEditingCourseId(null);
    setSelectedCourse(null);
  };

  // Create new course
  const createNewCourse = () => {
    resetForm();
  };

  return {
    // State
    courseName,
    setCourseName,
    courseDescription,
    setCourseDescription,
    isPublic,
    setIsPublic,
    courseStructure,
    setCourseStructure,
    expandedFolders,
    setExpandedFolders,
    editingNodeId,
    setEditingNodeId,
    editingValue,
    setEditingValue,
    editingLink,
    setEditingLink,
    myCourses,
    selectedCourse,
    editingCourseId,

    // Methods
    toggleFolder,
    addFolder,
    addFile,
    deleteNode,
    renameNode,
    updateFileLink,
    saveCourse,
    editCourse,
    deleteCourse,
    toggleCoursePrivacy,
    createNewCourse,
  };
};
