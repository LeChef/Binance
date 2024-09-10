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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      const success = await onSubmit(symbol.trim().toUpperCase());
      if (success) {
        setSymbol("");
        setErrorMessage("");
        onClose();
      } else {
        setErrorMessage(
          `${symbol.trim().toUpperCase()} is already in your list.`
        );
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Ticker</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <SearchIcon className="w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={symbol}
                onChange={(e) => {
                  setSymbol(e.target.value);
                  setErrorMessage(""); // Clear error when input changes
                }}
                placeholder="Enter ticker symbol (e.g. BTC)"
                className="flex-grow"
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm pl-8">{errorMessage}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
