import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  generateId,
  updateNodeInTree,
  renameInTree,
  updateLinkInTree,
  detectContentType,
} from "./courseUtils";

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

  // Save course
  const saveCourse = async () => {
    if (!courseName.trim()) {
      toast.error("Please enter course name");
      return;
    }
    if (courseStructure.length === 0) {
      toast.error("Please add at least one chapter");
      return;
    }

    const courseData = {
      id: editingCourseId || generateId(),
      name: courseName,
      description: courseDescription,
      isPublic,
      structure: courseStructure,
      createdAt: editingCourseId
        ? myCourses.find((c) => c.id === editingCourseId)?.createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updated;
    if (editingCourseId) {
      updated = myCourses.map((c) =>
        c.id === editingCourseId ? courseData : c,
      );
      toast.success("Course updated successfully!");
    } else {
      updated = [...myCourses, courseData];
      toast.success("Course created successfully!");
    }

    setMyCourses(updated);
    localStorage.setItem("freeCourses", JSON.stringify(updated));

    // Reset form
    resetForm();
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
