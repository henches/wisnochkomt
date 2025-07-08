import { Button } from "@/src/components/ui/button";
import { Expression } from "@/types/Expression";
import { Popover, PopoverArrow, PopoverContent, PopoverPortal, PopoverTrigger } from "@radix-ui/react-popover";
import { ICellRendererParams } from 'ag-grid-community';
import { Trash2Icon } from "lucide-react";
import { FunctionComponent, useState } from "react";
import { deleteExpressionAction } from "./expressions/expressions.action";

export const SuppressButonCellRenderer: FunctionComponent<ICellRendererParams<Expression>> = ({ data, context }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // const router = useRouter();

  const handleConfirm = async () => {
    if (!data?.id) return;
    const result = await deleteExpressionAction(data?.id);
    if (result.message) {
      context.refresh()
    }
  }
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Trash2Icon />
        </Button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          side="bottom"
          align="center"
          sideOffset={5}
          style={{
            backgroundColor: 'white',
            borderRadius: '4px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
          }}
        >
          <p>Confirmer suppression ?</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <Button onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button onClick={handleConfirm}>Valider</Button>
          </div>
          <PopoverArrow style={{ fill: 'white' }} />
        </PopoverContent>
      </PopoverPortal>
    </Popover >
  )
}