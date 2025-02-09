import React, { useState, useRef, useEffect } from 'react';

export default function QuestionUpload() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  // const [uploadedFiles, setUploadedFiles] = useState<{filename:string;content:string}[]>([]); // Track success or failure
  const inputRef = useRef<HTMLInputElement>(null);

  // const fetchFiles = async () => {
  //   try {
  //     const response = await fetch('http://localhost:4000/files'); // API to fetch files
  //     const data = await response.json();
  //     setUploadedFiles(data);
  //   } catch (error) {
  //     console.error('Error fetching files:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchFiles(); // Fetch files when component loads
  // }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    if (!inputRef.current?.files?.length) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', inputRef.current.files[0]);

    setUploading(true); // Show uploading status
    setUploadSuccess(null); // Reset the success state
    
    try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.text();  // Convert response to text
console.log(result);
      // const result = await response.json(); 
      if (response.ok) {
        setUploadSuccess(true); // Set success state
        console.log('File uploaded successfully');
      } else {
        setUploadSuccess(false); // Set failure state
        console.error('Error uploading file');
      }
    } catch (error) {
      setUploadSuccess(false); // Set failure state on error
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false); // Reset uploading status
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Upload Question File</h2>
      <input
        ref={inputRef}
        type="file"
        name="file"
        className="border p-2 w-full rounded-lg"
        onChange={handleChange}
        accept=".txt,.doc,.docx,.jpeg"
        required
      />
      {fileName && <p className="mt-2 text-sm text-gray-600">Selected file: {fileName}</p>}

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadSuccess === true && <p className="text-green-600 mt-2">File uploaded successfully!</p>}
      {uploadSuccess === false && <p className="text-red-600 mt-2">Failed to upload file. Please try again.</p>}
    </form>
  );
}
