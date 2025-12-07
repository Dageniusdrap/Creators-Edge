import React, { useState, useRef, useEffect } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { XIcon } from './icons/XIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const SingleInput: React.FC<{
    title: string;
    file: File | null;
    script: string;
    onFileChange: (file: File) => void;
    onScriptChange: (script: string) => void;
    onClearFile: () => void;
}> = ({ title, file, script, onFileChange, onScriptChange, onClearFile }) => {
    
    const [inputType, setInputType] = useState<'file' | 'text'>('file');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileChange(e.dataTransfer.files[0]);
            setInputType('file');
            e.dataTransfer.clearData();
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileChange(e.target.files[0]);
            setInputType('file');
        }
    };

    return (
        <div className="bg-black/20 p-4 rounded-lg">
            <h3 className="font-semibold text-center text-white mb-2">{title}</h3>
            <div className="flex bg-black/20 rounded-lg p-1 mb-4">
                <button onClick={() => setInputType('file')} className="w-1/2 py-1 text-xs font-semibold rounded-md relative text-gray-300 hover:text-white">
                    {inputType === 'file' && <motion.div layoutId={`ab-input-${title}`} className="absolute inset-0 bg-white/10 rounded-md" />}
                    <span className="relative z-10">Upload</span>
                </button>
                <button onClick={() => setInputType('text')} className="w-1/2 py-1 text-xs font-semibold rounded-md relative text-gray-300 hover:text-white">
                     {inputType === 'text' && <motion.div layoutId={`ab-input-${title}`} className="absolute inset-0 bg-white/10 rounded-md" />}
                    <span className="relative z-10">Paste Text</span>
                </button>
            </div>
            
            {inputType === 'file' ? (
                 file ? (
                    <div className="text-center p-2 bg-black/20 rounded-md">
                        <p className="text-xs font-medium text-white truncate">{file.name}</p>
                        <button onClick={onClearFile} className="text-[10px] text-red-400 hover:underline">Clear</button>
                    </div>
                ) : (
                    <div
                        className={`flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-indigo-500' : 'border-white/20 hover:border-indigo-500'}`}
                        onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadIcon className="h-6 w-6 text-gray-400" />
                        <p className="mt-1 text-xs text-gray-400">Upload or drop file</p>
                        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
                    </div>
                )
            ) : (
                <textarea
                    className="w-full h-24 p-2 text-sm bg-white/5 border border-white/20 rounded-md focus:ring-1 focus:ring-indigo-500 focus:outline-none text-white"
                    placeholder={`Paste script for ${title}...`}
                    value={script}
                    onChange={(e) => onScriptChange(e.target.value)}
                />
            )}
        </div>
    );
};


export const ABTestInput: React.FC = () => {
    const { 
        handleAnalysisSubmit, 
        isAnalyzing,
        contentInputs, setContentInputs,
        contentInputsB, setContentInputsB,
        selectedFile, handleFileSelect, handleClearFile,
        selectedFileB, handleFileSelectB, handleClearFileB,
    } = useAppContext();

    const canSubmit = !isAnalyzing && 
        ( (!!selectedFile || contentInputs.script.trim() !== '') &&
          (!!selectedFileB || (contentInputsB && contentInputsB.script.trim() !== '')) );

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SingleInput 
                    title="Content A"
                    file={selectedFile}
                    script={contentInputs.script}
                    onFileChange={handleFileSelect}
                    onScriptChange={script => setContentInputs(prev => ({...prev, script}))}
                    onClearFile={handleClearFile}
                />
                <SingleInput 
                    title="Content B"
                    file={selectedFileB}
                    script={contentInputsB?.script || ''}
                    onFileChange={handleFileSelectB}
                    onScriptChange={script => setContentInputsB(prev => ({...prev, script}))}
                    onClearFile={handleClearFileB}
                />
            </div>
             <div className="mt-6">
                <button
                    id="analysis-submit-button"
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center"
                    onClick={handleAnalysisSubmit}
                    disabled={!canSubmit}
                >
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    {isAnalyzing ? 'Comparing...' : 'Run A/B Test'}
                </button>
            </div>
        </div>
    );
};