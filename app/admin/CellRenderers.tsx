import { Expression } from "@/types/Expression";
import { ICellRendererParams } from 'ag-grid-community';
import { message, Modal } from "antd";
import { Trash2Icon } from "lucide-react";
import { FunctionComponent, useState } from "react";
import { deleteExpressionAction } from "./expressions/expressions.action";

export const SuppressButonCellRenderer: FunctionComponent<ICellRendererParams<Expression>> = ({ data, context }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleConfirm = async () => {
    if (!data?.id) return;
    const result = await deleteExpressionAction(data?.id);
    if (result.message) {
      message.success("suppression effectuée")
      context.refresh()
    }
  }
  return (
    <div style={{ display: 'flex', paddingTop: '10px' }} >
      <span onClick={() => { setIsOpen(true) }}>
        <Trash2Icon style={{ paddingTop: '5px', height: '20px' }} />
      </span>
      <Modal
        open={isOpen}
        title={`confirmer la suppression`}
        onOk={() => { setIsOpen(false); handleConfirm() }}
        onCancel={() => setIsOpen(false)}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      />
    </div>
  )
}
