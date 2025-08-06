import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Plus, ChevronRight, FileText, Image as ImageIcon, FileBox, Upload, X, CheckCircle, Eye, Trash2, AlertTriangle, ArrowLeft, Video, Folder, FolderOpen, Grid3X3, List, Search } from 'lucide-react';
import { TreeItem } from '../ui/tree-view';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../ui/dialog';
import { ListSkeleton, LoadingWithText } from '../ui/SkeletonLoader';

interface Category {
  _id: string;
  name: string;
  type: string;
  parentId?: string;
  path: string[];
  content?: {
    imageUrls: string[];
    pdfUrl?: string;
    text?: string;
    videoUrl?: string;
  };
}

interface ParentCategory {
  _id: string;
  name: string;
  path: string[];
}

interface UploadedFile {
  file: File;
  type: 'image' | 'pdf';
}

interface ContentResponse {
  message: string;
  content: {
    imageUrls: string[];
    pdfUrl?: string;
    text?: string;
    videoUrl?: string;
  };
}

// Content Preview Dialog Component
const ContentPreviewDialog = ({ 
  category, 
  isOpen, 
  onClose 
}: { 
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!category || !category.content) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            {category.name} - Content Preview
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Path: {category.path.join(' > ')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto">
          {/* Text Content */}
          {category.content.text && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Text Content
              </h4>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{category.content.text}</p>
              </div>
            </div>
          )}

          {/* Images */}
          {category.content.imageUrls && category.content.imageUrls.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-green-600" />
                Images ({category.content.imageUrls.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {category.content.imageUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={url}
                      alt={`Content ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                        Image {index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PDF */}
          {category.content.pdfUrl && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileBox className="w-5 h-5 text-red-600" />
                PDF Document
              </h4>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <a
                  href={category.content.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-blue-600 hover:text-blue-800 transition-colors p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300"
                >
                  <FileBox size={24} />
                  <div>
                    <div className="font-medium">View PDF Document</div>
                    <div className="text-sm text-gray-500">Click to open in new tab</div>
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* Video */}
          {category.content.videoUrl && (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-600" />
                Video
              </h4>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="relative overflow-hidden rounded-lg aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={getEmbedUrl(category.content.videoUrl)}
                    title="Video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Function to convert YouTube URL to embed URL
const getEmbedUrl = (url: string) => {
  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v');
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes('youtu.be')) {
    const videoId = url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
};

// Confirmation Dialog Component
const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="text-amber-600" size={20} />
            </div>
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all font-medium"
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Custom Toast component
const CustomToast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-lg flex items-center gap-3 z-50 max-w-sm ${
      type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
    }`}>
      <div className={`p-1 rounded-full ${type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
        {type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
      </div>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-700">
        <X size={16} />
      </button>
    </div>
  );
};

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [previousCategory, setPreviousCategory] = useState<Category | null>(null);
  const [categoryStack, setCategoryStack] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLastCategory, setIsLastCategory] = useState(false);
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewCategory, setPreviewCategory] = useState<Category | null>(null);
  const [contentType, setContentType] = useState<'text' | 'image' | 'pdf' | 'video' | null>(null);
  const [contentText, setContentText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });
  const [showMainCategoryDialog, setShowMainCategoryDialog] = useState(false);
  const [mainCategoryName, setMainCategoryName] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | ParentCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('adminToken');
  const apiBaseUrl = 'https://api.adhyan.guru/api';

  const { getRootProps, getInputProps } = useDropzone({
    accept: contentType === 'image' 
      ? { 'image/*': ['.png', '.jpg', '.jpeg'] } 
      : contentType === 'pdf' 
        ? { 'application/pdf': ['.pdf'] } 
        : {},
    onDrop: (acceptedFiles) => {
      if (contentType === 'image' || contentType === 'pdf') {
        const newFiles = acceptedFiles.map(file => ({
          file,
          type: contentType === 'image' ? 'image' as const : 'pdf' as const
        }));
        setUploadedFiles(newFiles);
      }
    },
    disabled: !contentType || contentType === 'text' || contentType === 'video',
    maxFiles: contentType === 'pdf' ? 1 : 5,
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePreviewClick = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewCategory(category);
    setShowPreviewDialog(true);
  };

  const handleDeleteClick = (category: Category | ParentCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    setCategoryToDelete(category);
    setShowDeleteConfirmation(true);
  };

  const deleteCategory = async () => {
    if (!categoryToDelete) return;
    
    setDeletingCategory(true);
    
    try {
      const response = await fetch(`${apiBaseUrl}/categories/${categoryToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setToast({
          show: true,
          message: `${categoryToDelete.name} deleted successfully`,
          type: 'success'
        });
        
        if (selectedCategory && selectedCategory._id === categoryToDelete._id) {
          setSelectedCategory(null);
        }
        
        if ('parentId' in categoryToDelete && categoryToDelete.parentId) {
          fetchCategories(categoryToDelete.parentId);
        } else {
          fetchParentCategories();
          setCategories([]);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete category');
        setToast({
          show: true,
          message: `Failed to delete: ${errorData.message || 'Unknown error'}`,
          type: 'error'
        });
      }
    } catch (err) {
      setError('Failed to delete category');
      setToast({
        show: true,
        message: 'Failed to delete category due to a network error',
        type: 'error'
      });
    } finally {
      setDeletingCategory(false);
      setShowDeleteConfirmation(false);
      setCategoryToDelete(null);
    }
  };

  const handleAddMainCategory = async () => {
    if (!mainCategoryName.trim()) return;

    try {
      const response = await fetch(`${apiBaseUrl}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: mainCategoryName,
          type: 'category'
        })
      });

      if (response.ok) {
        setToast({
          show: true,
          message: 'Main category created successfully',
          type: 'success'
        });
        setMainCategoryName('');
        setShowMainCategoryDialog(false);
        fetchParentCategories();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create main category');
      }
    } catch (err) {
      setError('Failed to create main category');
    }
  };

  const fetchParentCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBaseUrl}/categories/parents`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch parent categories');
      }
      
      const data = await response.json();
      setParentCategories(data[0]?.parents || []);
    } catch (err) {
      setError('Failed to fetch parent categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (parentId?: string) => {
    try {
      setLoading(true);
      const url = parentId 
        ? `${apiBaseUrl}/categories/subcategories/${parentId}`
        : `${apiBaseUrl}/categories`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      const subcategories = parentId && data[0]?.subcategories ? data[0].subcategories : data || [];
      setCategories(subcategories);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParentCategories();
  }, []);

  const handleCategoryClick = async (category: Category | ParentCategory) => {
    if (selectedCategory) {
      setCategoryStack(prev => [...prev, selectedCategory as Category]);
    }
    
    setSelectedCategory(category as Category);
    await fetchCategories(category._id);
  };

  const handleGoBack = async () => {
    if (categoryStack.length > 0) {
      const prevCategory = categoryStack[categoryStack.length - 1];
      setCategoryStack(prev => prev.slice(0, -1));
      
      if (!prevCategory.parentId) {
        setCategoryStack([]);
      }
      
      setSelectedCategory(prevCategory);
      
      if (prevCategory.parentId) {
        await fetchCategories(prevCategory.parentId);
      } else {
        await fetchCategories(prevCategory._id);
        fetchParentCategories();
      }
    } else {
      if (selectedCategory && selectedCategory.parentId) {
        try {
          const response = await fetch(`${apiBaseUrl}/categories/${selectedCategory.parentId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const parentCategory = await response.json();
            setSelectedCategory(parentCategory);
            
            if (parentCategory.parentId) {
              await fetchCategories(parentCategory.parentId);
            } else {
              await fetchCategories(parentCategory._id);
              fetchParentCategories();
            }
          }
        } catch (err) {
          setError('Failed to fetch parent category');
        }
      } else {
        setSelectedCategory(null);
        setCategories([]);
        fetchParentCategories();
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) return;

    try {
      const payload = {
        name: newCategoryName,
        type: isLastCategory ? 'content' : 'category',
        ...(selectedCategory && { parentId: selectedCategory._id })
      };

      const response = await fetch(`${apiBaseUrl}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setToast({
          show: true,
          message: `${newCategoryName} added successfully`,
          type: 'success'
        });
        
        setNewCategoryName('');
        if (selectedCategory) {
          fetchCategories(selectedCategory._id);
        } else {
          fetchParentCategories();
        }

        const data = await response.json();
        if (isLastCategory) {
          setSelectedCategory(data);
        }
      } else {
        setError('Failed to add category');
      }
    } catch (err) {
      setError('Failed to add category');
    }
  };

  const openContentDialog = (type: 'text' | 'image' | 'pdf' | 'video') => {
    setContentType(type);
    setContentText('');
    setVideoUrl('');
    setUploadedFiles([]);
    setShowContentDialog(true);
  };

  const validateYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const handleAddContent = async () => {
    if (!selectedCategory || !contentType) return;
    setUploadProgress(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('categoryid', selectedCategory._id);
      
      if (contentType === 'text' && contentText.trim()) {
        formData.append('text', contentText);
      } else if (contentType === 'image') {
        uploadedFiles.forEach(({ file }) => {
          formData.append('images', file);
        });
      } else if (contentType === 'pdf' && uploadedFiles.length > 0) {
        formData.append('pdf', uploadedFiles[0].file);
      } else if (contentType === 'video' && videoUrl.trim()) {
        if (!validateYouTubeUrl(videoUrl)) {
          setError('Please enter a valid YouTube URL');
          setUploadProgress(false);
          return;
        }
        formData.append('videoUrl', videoUrl);
      }

      const response = await fetch(`${apiBaseUrl}/categories/content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data: ContentResponse = await response.json();
        setToast({
          show: true,
          message: data.message || `${contentType} content added successfully`,
          type: 'success'
        });
        
        setShowContentDialog(false);
        setContentType(null);
        setContentText('');
        setVideoUrl('');
        setUploadedFiles([]);
        
        if (selectedCategory.parentId) {
          fetchCategories(selectedCategory.parentId);
        } else {
          fetchParentCategories();
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add content');
      }
    } catch (err) {
      setError('Failed to add content');
    } finally {
      setUploadProgress(false);
    }
  };

  const isContentCategory = (category: Category) => {
    return category.type === 'content';
  };

  const hasContent = (category: Category) => {
    return category.content && (
      category.content.text ||
      (category.content.imageUrls && category.content.imageUrls.length > 0) ||
      category.content.pdfUrl ||
      category.content.videoUrl
    );
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex gap-6 h-full">
      {/* Enhanced Sidebar */}
      <div className="w-80 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Categories</h2>
          <button
            onClick={() => setShowMainCategoryDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 font-medium shadow-md"
          >
            <Plus size={18} />
            <span>Add Main</span>
          </button>
        </div>
        
        {loading && parentCategories.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-3 text-gray-400">
              <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
              <span>Loading categories...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {parentCategories.map((parent) => (
              <div key={parent._id} className="relative group">
                <div
                  onClick={() => handleCategoryClick(parent)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <Folder className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-800">{parent.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <button
                  onClick={(e) => handleDeleteClick(parent, e)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-all bg-white rounded-full shadow-sm"
                  title="Delete category"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Main Content */}
      <div className="flex-1 space-y-6">
        {/* Enhanced Add Category Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 flex items-center gap-2 transition-all disabled:opacity-50 font-medium shadow-md"
              >
                <Plus size={20} />
                Add {selectedCategory ? 'Sub' : ''}Category
              </button>
            </div>
            {selectedCategory && (
              <label className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <input
                  type="checkbox"
                  checked={isLastCategory}
                  onChange={(e) => setIsLastCategory(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>This is a final category (will contain content)</span>
              </label>
            )}
          </div>
        </div>

        {/* Enhanced Selected Category Content */}
        {selectedCategory && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleGoBack}
                  className="p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex items-center gap-2 font-medium"
                  title="Go back to previous category"
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedCategory.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Path: {selectedCategory.path.join(' > ')}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => handleDeleteClick(selectedCategory, e)}
                className="p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center gap-2 font-medium"
                title="Delete this category"
              >
                <Trash2 size={18} />
                <span>Delete</span>
              </button>
            </div>
            
            {/* Enhanced Add Content Buttons for Final Categories */}
            {isContentCategory(selectedCategory) && (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Content</h3>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => openContentDialog('text')}
                    className="bg-blue-100 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-200 transition-all font-medium"
                  >
                    <FileText size={18} />
                    Add Text
                  </button>
                  <button 
                    onClick={() => openContentDialog('image')}
                    className="bg-green-100 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-green-200 transition-all font-medium"
                  >
                    <ImageIcon size={18} />
                    Add Images
                  </button>
                  <button 
                    onClick={() => openContentDialog('pdf')}
                    className="bg-red-100 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-red-200 transition-all font-medium"
                  >
                    <FileBox size={18} />
                    Add PDF
                  </button>
                  <button 
                    onClick={() => openContentDialog('video')}
                    className="bg-purple-100 text-purple-700 px-4 py-3 rounded-lg flex items-center gap-2 hover:bg-purple-200 transition-all font-medium"
                  >
                    <Video size={18} />
                    Add Video
                  </button>
                </div>
              </div>
            )}
            
            {/* Enhanced Search and View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <span className="text-sm text-gray-500">
                  {filteredCategories.length} {filteredCategories.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
            
            {/* Enhanced Category Content Display */}
            {loading ? (
              <ListSkeleton />
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No categories found</p>
                <p className="text-sm text-gray-400 mt-2">
                  {searchTerm ? 'Try adjusting your search terms' : 'Add a new category using the form above'}
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredCategories.map((category) => (
                  <div
                    key={category._id}
                    className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer group relative ${
                      viewMode === 'list' ? 'p-4' : 'p-6'
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {isContentCategory(category) ? (
                            <FolderOpen className="w-5 h-5 text-purple-600" />
                          ) : (
                            <Folder className="w-5 h-5 text-blue-600" />
                          )}
                          <h3 className="font-semibold text-gray-800">{category.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          {isContentCategory(category) ? 'Content Category' : 'Category'}
                        </p>
                        
                        {/* Enhanced Content Indicators */}
                        {isContentCategory(category) && hasContent(category) && (
                          <div className="flex flex-wrap gap-2">
                            {category.content?.text && (
                              <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                                <FileText size={12} className="mr-1" />
                                Text
                              </span>
                            )}
                            {category.content?.imageUrls && category.content.imageUrls.length > 0 && (
                              <span className="inline-flex items-center bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                <ImageIcon size={12} className="mr-1" />
                                Images ({category.content.imageUrls.length})
                              </span>
                            )}
                            {category.content?.pdfUrl && (
                              <span className="inline-flex items-center bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                                <FileBox size={12} className="mr-1" />
                                PDF
                              </span>
                            )}
                            {category.content?.videoUrl && (
                              <span className="inline-flex items-center bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                                <Video size={12} className="mr-1" />
                                Video
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Enhanced Action buttons */}
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      {isContentCategory(category) && hasContent(category) && (
                        <button 
                          onClick={(e) => handlePreviewClick(category, e)}
                          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all"
                          title="Preview content"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button 
                        onClick={(e) => handleDeleteClick(category, e)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-all"
                        title="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Add Main Category Dialog */}
      <Dialog open={showMainCategoryDialog} onOpenChange={setShowMainCategoryDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add Main Category</DialogTitle>
            <DialogDescription className="text-gray-600">
              Create a new top-level category to organize your content
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={mainCategoryName}
              onChange={(e) => setMainCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowMainCategoryDialog(false)}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMainCategory}
              disabled={!mainCategoryName.trim()}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 font-medium"
            >
              Add Category
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Content Dialog */}
      <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Add {contentType === 'text' ? 'Text' : contentType === 'image' ? 'Images' : contentType === 'pdf' ? 'PDF' : 'Video'} Content
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {contentType === 'text' ? 'Add rich text content to this category' : 
               contentType === 'image' ? 'Upload up to 5 images (PNG, JPG, JPEG)' : 
               contentType === 'pdf' ? 'Upload a PDF document' : 
               'Add a YouTube video URL'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            {contentType === 'text' && (
              <textarea
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                placeholder="Enter your text content here..."
                className="w-full h-64 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            )}
            
            {contentType === 'video' && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=...)"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-sm text-gray-500">
                  Supported formats: YouTube URLs only
                </p>
              </div>
            )}
            
            {(contentType === 'image' || contentType === 'pdf') && (
              <div>
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition-all"
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="text-gray-400" size={40} />
                    <p className="text-gray-600 font-medium">
                      Drag & drop 
                      {contentType === 'image' ? ' images' : ' a PDF file'} 
                      here, or click to select
                    </p>
                    <span className="text-sm text-gray-400">
                      {contentType === 'image' ? 'PNG, JPG, JPEG up to 5 files' : 'PDF files only'}
                    </span>
                  </div>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                      {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'} selected
                    </p>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          {file.type === 'image' ? (
                            <ImageIcon size={20} className="text-green-600" />
                          ) : (
                            <FileBox size={20} className="text-red-600" />
                          )}
                          <div>
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[300px] block">
                              {file.file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({(file.file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowContentDialog(false)}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAddContent}
              disabled={
                uploadProgress || 
                (contentType === 'text' && !contentText.trim()) || 
                (contentType === 'image' && uploadedFiles.length === 0) ||
                (contentType === 'pdf' && uploadedFiles.length === 0) ||
                (contentType === 'video' && !videoUrl.trim())
              }
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center gap-2 font-medium"
            >
              {uploadProgress ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Add Content</span>
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content Preview Dialog */}
      {previewCategory && (
        <ContentPreviewDialog
          category={previewCategory}
          isOpen={showPreviewDialog}
          onClose={() => setShowPreviewDialog(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={deleteCategory}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone and will remove all subcategories and content.`}
      />

      {/* Toast Notification */}
      {toast.show && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}

export default Categories;