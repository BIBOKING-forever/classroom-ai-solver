import React, { useState, useRef } from 'react';

interface CreatePostProps {
  onPost: (content: string, attachment?: string, attachmentName?: string, attachmentMimeType?: string) => void;
  isSolving: boolean;
  classNameStr: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPost, isSolving, classNameStr }) => {
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<{
    data: string;
    name: string;
    type: string;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePost = () => {
    if (text.trim() || selectedFile) {
      onPost(text, selectedFile?.data, selectedFile?.name, selectedFile?.type);
      setText('');
      setSelectedFile(null);
      setIsActive(false);
    }
  };

  const handleCancel = () => {
    setText('');
    setSelectedFile(null);
    setIsActive(false);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({
          data: reader.result as string,
          name: file.name,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isImage = (mimeType: string) => mimeType.startsWith('image/');

  if (!isActive) {
    return (
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsActive(true)}
      >
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white">A</div>
        <div className="text-gray-500 text-sm font-medium flex-grow hover:text-gray-700">
          Announce something to your class (Ask AI)
        </div>
        <div className="p-2 rounded-full hover:bg-gray-200 text-gray-600">
          <span className="material-icons-outlined">cached</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-4 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
          <span className="text-xs font-bold text-gray-500">For</span>
          <span className="ml-2 text-sm font-medium text-gray-800 bg-gray-200 px-2 py-1 rounded">{classNameStr}</span>
          <span className="ml-2 text-sm font-medium text-gray-800 bg-gray-200 px-2 py-1 rounded">All students</span>
      </div>
      <div className="p-4">
        <textarea
          className="w-full resize-none outline-none text-gray-800 placeholder-gray-500 min-h-[120px]"
          placeholder={`Ask a question about ${classNameStr}...`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
        
        {selectedFile && (
          <div className="mt-4 relative inline-block group">
            {isImage(selectedFile.type) ? (
               <img 
                 src={selectedFile.data} 
                 alt="Attachment preview" 
                 className="max-h-48 rounded-md border border-gray-200"
               />
            ) : (
               <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg w-64">
                  <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded text-red-600">
                    <span className="material-icons-outlined">description</span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-gray-700 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 truncate">{selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE'}</p>
                  </div>
               </div>
            )}
            <button 
              onClick={removeFile}
              className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-700 shadow-md"
            >
              <span className="material-icons text-sm block">close</span>
            </button>
          </div>
        )}
      </div>
      <div className="p-4 flex items-center justify-between border-t border-gray-100">
        <div className="flex gap-2 text-gray-500">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
              className="hidden" 
            />
            <button 
              onClick={handleFileClick}
              className={`p-2 hover:bg-gray-100 rounded-full border border-gray-200 ${selectedFile ? 'text-green-700 bg-green-50 border-green-200' : ''}`}
              title="Upload file (Image, PDF, Word)"
            >
              <span className="material-icons-outlined">upload_file</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full border border-gray-200"><span className="material-icons-outlined">add_link</span></button>
            <button className="p-2 hover:bg-gray-100 rounded-full border border-gray-200"><span className="material-icons-outlined">youtube_searched_for</span></button>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button 
            onClick={handlePost}
            disabled={(!text.trim() && !selectedFile) || isSolving}
            className={`px-6 py-2 text-sm font-medium text-white rounded shadow-sm ${
              (!text.trim() && !selectedFile) || isSolving ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800'
            }`}
          >
            {isSolving ? 'Solving...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;