import { PlusIcon } from "lucide-react";

const AddTicker = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="bg-card text-card-foreground p-4 rounded-lg shadow-sm flex flex-col items-center justify-center h-full hover:bg-accent transition-colors"
    aria-label="Add new ticker"
  >
    <PlusIcon className="w-6 h-6" />
    <span className="mt-2">Add Ticker</span>
  </button>
);

export default AddTicker;
