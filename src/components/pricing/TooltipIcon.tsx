import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TooltipIconProps {
  text: string;
}

const TooltipIcon = ({ text }: TooltipIconProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className="inline-flex cursor-help ml-1 text-muted-foreground hover:text-foreground transition-colors">
        <HelpCircle className="w-4 h-4" />
      </span>
    </TooltipTrigger>
    <TooltipContent className="max-w-[200px] text-center">
      <p className="text-xs">{text}</p>
    </TooltipContent>
  </Tooltip>
);

export default TooltipIcon;
