import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (symbol: string) => Promise<boolean>;
}

const SearchModal = ({ isOpen, onClose, onSubmit }: SearchModalProps) => {
  const [symbol, setSymbol] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const success = await onSubmit(symbol.trim().toUpperCase());
        if (success) {
          setSymbol("");
          setErrorMessage("");
          onClose();
        } else {
          setErrorMessage(
            `Failed to add ${symbol
              .trim()
              .toUpperCase()}. It may already be in your list or not found.`
          );
        }
      } catch (error) {
        console.error("Error submitting symbol:", error);
        setErrorMessage("An unexpected error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Ticker</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <SearchIcon className="w-5 h-5 text-gray-400" />
              <Input
                type="text"
                value={symbol}
                onChange={(e) => {
                  setSymbol(e.target.value);
                  setErrorMessage(""); // Clear error when input changes
                }}
                placeholder="Enter ticker symbol (e.g. BTC)"
                className="flex-grow bg-gray-700 text-white placeholder-gray-400 border-gray-600"
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm pl-8">{errorMessage}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gray-700 text-white hover:bg-gray-600"
            >
              Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
