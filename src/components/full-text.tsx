import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {cn} from "@/lib/utils";

type FullTextProps = {
    text: string | null | undefined;
    className?: string;
};

export const FullText = ({text, className}: FullTextProps) => {
    if (!text) {
        return <span className={className}>-</span>;
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className={cn(className)}>{text}</span>
            </TooltipTrigger>
            <TooltipContent>{text}</TooltipContent>
        </Tooltip>
    );
};