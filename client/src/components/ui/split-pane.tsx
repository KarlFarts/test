import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface SplitPaneProps {
  children: [React.ReactNode, React.ReactNode];
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  onResize?: (size: number) => void;
  storageKey?: string; // For persisting user preferences
}

export function SplitPane({
  children,
  defaultSize = 300,
  minSize = 200,
  maxSize = 600,
  className,
  onResize,
  storageKey
}: SplitPaneProps) {
  const [leftWidth, setLeftWidth] = useState(() => {
    if (storageKey && typeof window !== "undefined") {
      const stored = localStorage.getItem(`splitpane-${storageKey}`);
      return stored ? parseInt(stored, 10) : defaultSize;
    }
    return defaultSize;
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startWidthRef.current = leftWidth;
    
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [leftWidth]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startXRef.current;
    const newWidth = Math.max(
      minSize,
      Math.min(maxSize, startWidthRef.current + deltaX)
    );

    setLeftWidth(newWidth);
    onResize?.(newWidth);
  }, [isDragging, minSize, maxSize, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    // Persist to localStorage if storageKey is provided
    if (storageKey && typeof window !== "undefined") {
      localStorage.setItem(`splitpane-${storageKey}`, leftWidth.toString());
    }
  }, [leftWidth, storageKey]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={cn("flex h-full overflow-hidden", className)}
    >
      {/* Left Pane */}
      <motion.div
        className="flex-shrink-0 overflow-hidden"
        style={{ width: leftWidth }}
        animate={{ width: leftWidth }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        {children[0]}
      </motion.div>

      {/* Resizer */}
      <div
        className={cn(
          "relative flex items-center justify-center w-1 bg-border hover:bg-primary/20 cursor-col-resize transition-colors group",
          isDragging && "bg-primary/30"
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
          <GripVertical className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>

      {/* Right Pane */}
      <div className="flex-1 overflow-hidden">
        {children[1]}
      </div>
    </div>
  );
}

// Master-Detail layout component
interface MasterDetailProps {
  master: React.ReactNode;
  detail: React.ReactNode;
  masterWidth?: number;
  minMasterWidth?: number;
  maxMasterWidth?: number;
  className?: string;
  storageKey?: string;
}

export function MasterDetail({
  master,
  detail,
  masterWidth = 350,
  minMasterWidth = 250,
  maxMasterWidth = 500,
  className,
  storageKey = "master-detail"
}: MasterDetailProps) {
  return (
    <SplitPane
      defaultSize={masterWidth}
      minSize={minMasterWidth}
      maxSize={maxMasterWidth}
      className={className}
      storageKey={storageKey}
    >
      <div className="h-full border-r bg-muted/30">
        {master}
      </div>
      <div className="h-full bg-background">
        {detail}
      </div>
    </SplitPane>
  );
}

// Vertical split pane for stacked layouts
export function VerticalSplitPane({
  children,
  defaultSize = 200,
  minSize = 100,
  maxSize = 400,
  className,
  onResize,
  storageKey
}: Omit<SplitPaneProps, "children"> & {
  children: [React.ReactNode, React.ReactNode];
}) {
  const [topHeight, setTopHeight] = useState(() => {
    if (storageKey && typeof window !== "undefined") {
      const stored = localStorage.getItem(`vsplitpane-${storageKey}`);
      return stored ? parseInt(stored, 10) : defaultSize;
    }
    return defaultSize;
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    startHeightRef.current = topHeight;
    
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, [topHeight]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaY = e.clientY - startYRef.current;
    const newHeight = Math.max(
      minSize,
      Math.min(maxSize, startHeightRef.current + deltaY)
    );

    setTopHeight(newHeight);
    onResize?.(newHeight);
  }, [isDragging, minSize, maxSize, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    if (storageKey && typeof window !== "undefined") {
      localStorage.setItem(`vsplitpane-${storageKey}`, topHeight.toString());
    }
  }, [topHeight, storageKey]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={cn("flex flex-col h-full overflow-hidden", className)}
    >
      {/* Top Pane */}
      <motion.div
        className="flex-shrink-0 overflow-hidden"
        style={{ height: topHeight }}
        animate={{ height: topHeight }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        {children[0]}
      </motion.div>

      {/* Resizer */}
      <div
        className={cn(
          "relative flex items-center justify-center h-1 bg-border hover:bg-primary/20 cursor-row-resize transition-colors",
          isDragging && "bg-primary/30"
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="w-8 h-1 bg-muted-foreground/30 rounded-full" />
      </div>

      {/* Bottom Pane */}
      <div className="flex-1 overflow-hidden">
        {children[1]}
      </div>
    </div>
  );
}
