import type { Route } from "./+types/_index";
import { CheckCircle2Icon } from "lucide-react";
import { Button } from "@gaming/ui/components/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@gaming/ui/components/alert";

export default function Home(props: Route.ComponentProps) {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-2 flex flex-col gap-4">
      <h3 className="text-2xl font-bold">
        Home Page
      </h3>

      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>Success! Your changes have been saved</AlertTitle>
        <AlertDescription>
          This is an alert with icon, title and description.
        </AlertDescription>
      </Alert>

      <Button>Click me</Button>
    </div>
  );
}
