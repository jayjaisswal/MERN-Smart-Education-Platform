// Generate unique IDs
export const generateId = () =>
  `_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Update node in tree
export const updateNodeInTree = (tree, nodeId, callback) => {
  tree.forEach((node) => {
    if (node.id === nodeId) {
      callback(node);
    } else if (node.children) {
      updateNodeInTree(node.children, nodeId, callback);
    }
  });
};

// Rename node in tree
export const renameInTree = (node, id, newName) => {
  if (node.id === id) {
    return { ...node, name: newName };
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map((child) => renameInTree(child, id, newName)),
    };
  }
  return node;
};

// Detect content type from URL
export const detectContentType = (url) => {
  if (!url) return "link";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "video";
  if (url.endsWith(".pdf")) return "pdf";
  return "link";
};

// Update link in tree
export const updateLinkInTree = (node, id, link) => {
  if (node.id === id) {
    return {
      ...node,
      link,
      contentType: detectContentType(link),
    };
  }
  if (node.children) {
    return {
      ...node,
      children: node.children.map((child) => updateLinkInTree(child, id, link)),
    };
  }
  return node;
};
