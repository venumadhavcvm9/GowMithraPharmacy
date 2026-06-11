import { useState } from 'react';

export function useDragAndDrop(setReceiptImage: (val: string | null) => void) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReceiptImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return { dragActive, handleDrag, handleDrop };
}
