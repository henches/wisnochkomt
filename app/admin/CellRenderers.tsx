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
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '15px'}} >
      <span onClick={() => { setIsOpen(true) }}>
        <Trash2Icon style={{
          height: '15px' }} />
      </span>
      <Modal
        open={isOpen}
        title={`Confirmer la suppression`}
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
