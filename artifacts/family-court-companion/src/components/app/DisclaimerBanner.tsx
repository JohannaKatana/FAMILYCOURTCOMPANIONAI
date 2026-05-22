import { InfoIcon } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-md flex items-start gap-3 my-4">
      <InfoIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <p className="text-sm text-primary-foreground/80 dark:text-primary-foreground/90 text-slate-800 dark:text-slate-200">
        <span className="font-semibold block mb-1">Important Notice</span>
        This AI analysis is for informational purposes only and does not constitute legal advice. Always consult with a licensed attorney before making legal decisions.
      </p>
    </div>
  );
}