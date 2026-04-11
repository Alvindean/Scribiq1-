import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CourseNotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
        <BookOpen className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Course not found</h1>
      <p className="text-muted-foreground mb-8 max-w-sm">
        This course is not available. It may have been unpublished or the link
        may be incorrect.
      </p>
      <Button asChild variant="outline">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}
