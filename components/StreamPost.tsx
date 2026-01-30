import React from 'react';
import { StreamPostData } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css'; 

interface StreamPostProps {
  post: StreamPostData;
}

const StreamPost: React.FC<StreamPostProps> = ({ post }) => {
  const isImage = (mimeType?: string) => mimeType?.startsWith('image/');

  return (
    <div className={`bg-white rounded-lg border border-gray-200 mb-4 ${post.isAi ? 'border-l-4 border-l-blue-500 shadow-md' : 'shadow-sm'}`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {post.authorAvatar ? (
               <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover" />
            ) : (
               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${post.isAi ? 'bg-blue-600' : 'bg-slate-700'}`}>
                 {post.isAi ? <span className="material-icons text-sm">auto_awesome</span> : post.authorName[0]}
               </div>
            )}
            <div>
              <div className="font-medium text-gray-900 text-sm">{post.authorName}</div>
              <div className="text-xs text-gray-500">{post.date}</div>
            </div>
          </div>
          <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full">
            <span className="material-icons-outlined text-xl">more_vert</span>
          </button>
        </div>
        
        <div className="text-sm text-gray-800 leading-relaxed prose prose-sm max-w-none overflow-x-auto">
            <ReactMarkdown
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code: ({node, className, children, ...props}: any) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>
                  ) : (
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-3">
                      <code className={`${className} text-sm font-mono`} {...props}>{children}</code>
                    </pre>
                  );
                },
                table: ({children}: any) => (
                  <div className="overflow-x-auto my-3">
                    <table className="min-w-full border-collapse border border-gray-300">{children}</table>
                  </div>
                ),
                th: ({children}: any) => (
                  <th className="border border-gray-300 bg-gray-100 px-3 py-2 text-left font-semibold">{children}</th>
                ),
                td: ({children}: any) => (
                  <td className="border border-gray-300 px-3 py-2">{children}</td>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
        </div>

        {post.attachment && (
          <div className="mt-4">
             {isImage(post.attachmentMimeType) ? (
                <img 
                  src={post.attachment} 
                  alt={post.attachmentName || "Attachment"} 
                  className="max-h-80 rounded-lg border border-gray-200"
                />
             ) : (
                <a href={post.attachment} download={post.attachmentName} className="block group">
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors w-full md:w-96">
                     <div className="w-12 h-12 flex items-center justify-center bg-red-50 rounded text-red-600 group-hover:bg-red-100">
                        <span className="material-icons-outlined text-2xl">
                          {post.attachmentMimeType?.includes('pdf') ? 'picture_as_pdf' : 'description'}
                        </span>
                     </div>
                     <div className="flex-grow overflow-hidden">
                        <div className="text-sm font-medium text-gray-700 truncate group-hover:text-blue-700 group-hover:underline">
                          {post.attachmentName || "Attached File"}
                        </div>
                        <div className="text-xs text-gray-500 uppercase">
                          {post.attachmentMimeType ? post.attachmentMimeType.split('/')[1].replace('vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx') : 'FILE'}
                        </div>
                     </div>
                  </div>
                </a>
             )}
          </div>
        )}

        {post.sources && post.sources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Sources</h4>
            <div className="flex flex-wrap gap-2">
              {post.sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-xs text-blue-600 transition-colors truncate max-w-full"
                >
                  <span className="material-icons text-[14px]">public</span>
                  <span className="truncate max-w-[200px]">{source.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
      
      <div className="px-4 py-3 border-t border-gray-100">
         <div className="flex items-center gap-3 cursor-pointer group">
             <span className="material-icons-outlined text-gray-500 group-hover:text-gray-700">group</span>
             <input 
                type="text" 
                placeholder="Add class comment..." 
                className="flex-grow text-sm outline-none placeholder-gray-500 text-gray-700 group-hover:placeholder-gray-600 bg-transparent"
             />
             <button className="text-gray-400 hover:text-green-700">
                <span className="material-icons text-lg">send</span>
             </button>
         </div>
      </div>
    </div>
  );
};

export default StreamPost;