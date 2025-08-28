"use client"
import { Expression } from "@/types/Expression";
import '@ant-design/v5-patch-for-react-19';
import { AgGridReact } from "ag-grid-react";
import { App, Button, Form, FormProps, Input, message, Modal } from 'antd';
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import "tailwindcss";
import { createExpressionAction, deleteExpressionAction, getExpressionsAction, modifyExpressionAction } from "./actions/expressions.action";
import { ExpressionsGrid } from "./expressionsGrid/ExpressionsGrid";
import TextArea from "antd/es/input/TextArea";
import modal from "antd/es/modal";

type RowType = {
  text?: string
  author?: string
  info?: string
};

const INTITIAL_VALUES = {
  text: '',
  info: ''
}

export interface MainPageProps {
  gridRef: React.RefObject<AgGridReact | null>,
  refreshRef: React.RefObject<VoidFunction | null>
}

export default function MainPage({ gridRef, refreshRef }: MainPageProps) {
  const [expressions, setExpressions] = useState<Expression[]>()
  const [createOrModifyId, setCreateOrModifyId] = useState<number | null | undefined>(null); // null: popin close, undefined : creation, number : id de l'expression
  const [form] = Form.useForm<RowType>();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [hasFormChanged, setHasFormChanged] = useState<boolean>(false)
  const [textFilter, setTextFilter] = useState<string>('')

  const { message, modal } = App.useApp();

  const refresh = useCallback(async () => {
    const _expressions = await getExpressionsAction()
    setExpressions(_expressions)
  }, []);

  useEffect(() => {
    refreshRef.current = refresh
  }, [refreshRef, refresh]);

  useEffect(() => {
    refresh();
  }, [refresh])

  useEffect(() => {
    if (createOrModifyId === null || !expressions) return;
    if (createOrModifyId === undefined) form.resetFields();
    else {
      const expression = expressions.find(expression => expression.id === createOrModifyId);
      if (!expression) throw Error("Should never happen");
      const fieldsValue: RowType = {
        text: expression.text,
        author: expression.author,
        info: expression.info
      }
      form.setFieldsValue(fieldsValue)
    }
  }, [createOrModifyId, expressions, form])

  const onFinish: FormProps<RowType>['onFinish'] = async (values: RowType) => {
    if (createOrModifyId === null) return;
    const expression: Expression = {
      text: values.text ?? '',
      author: values.author ?? '',
      info: values.info ?? ''
    }
    const result = await (createOrModifyId === undefined ?
      createExpressionAction(expression) :
      modifyExpressionAction(createOrModifyId, expression));
    message.success(createOrModifyId === undefined ? "Crée" : "Modifié");
    if (result.message) {
      refresh();
    }
  };

  const onFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextFilter(event.target.value)
  };

  const onOk = () => { form.submit(); setCreateOrModifyId(null) }

  const deleteExpression = async () => {
    if (!createOrModifyId) return;
    const result = await deleteExpressionAction(createOrModifyId);
    if (result.message) {
      message.success("suppression effectuée")
      setCreateOrModifyId(null);
      refresh()
    }
  }

  const onDelete = () => {
    modal.confirm({
      title: "Supprimer la ligne ?",
      content: "Cette action est irréversible.",
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk: deleteExpression,
    });
  };


  return (
    <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', padding: '10px', paddingBottom: '20px', gap: '15px' }}>
        <div style={{ flexGrow: 1, gap: '10px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Input value={textFilter} onChange={onFilterChange} placeholder='filtre' style={{ maxWidth: 200, minWidth: 150 }} />
            <span>{expressions ? expressions.length : ''}</span>
            <Button onClick={() => setCreateOrModifyId(undefined)}>
              <PlusIcon />
            </Button>
          </div>
          <ExpressionsGrid
            gridRef={gridRef as React.RefObject<AgGridReact>}
            expressions={expressions}
            refresh={refresh}
            actOnRowClick={setCreateOrModifyId}
            textFilter={textFilter} />
        </div>
      </div>
      <Modal
        open={createOrModifyId !== null}
        title={`${createOrModifyId === undefined ? 'Ajouter' : 'Modifier'} une expression`}
        onOk={onOk}
        onCancel={() => setCreateOrModifyId(null)}
        footer={
          <div key="footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button key='suppress' style={{ marginRight: "auto" }} danger onClick={onDelete}>
              Supprimer
            </Button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button key="back" onClick={() => setCreateOrModifyId(null)} disabled={hasFormChanged}>
                Annuler
              </Button>
              <Button key="submit" onClick={onOk} disabled={hasFormChanged} >
                Confirmer
              </Button>
            </div>
          </div>
        }
      >
        <Form form={form} style={{ maxWidth: 600 }} initialValues={INTITIAL_VALUES}
          onFinish={onFinish}
        >
          <Form.Item<RowType> label="Texte" name="text" rules={[{ required: true, message: 'Merci de saisir le texte' }]}  >
            <TextArea rows={4} style={{ caretColor: 'white' }} />
          </Form.Item>
          <Form.Item<RowType> label="Auteur" name="author" >
            <TextArea rows={2} style={{ caretColor: 'white' }} />
          </Form.Item>
          <Form.Item<RowType> label="Contexte" name="info" >
            <TextArea rows={4} style={{ caretColor: 'white' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
