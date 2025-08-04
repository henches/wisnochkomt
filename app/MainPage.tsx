"use client"
import { Expression } from "@/types/Expression";
import '@ant-design/v5-patch-for-react-19';
import { AgGridReact } from "ag-grid-react";
import { Button, Form, FormProps, Input, message, Modal } from 'antd';
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import "tailwindcss";
import { createExpressionAction, getExpressionsAction, modifyExpressionAction } from "./admin/expressions/expressions.action";
import { ExpressionsGrid } from "./admin/ExpressionsGrid";
import TextArea from "antd/es/input/TextArea";

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
  const [expressions, setExpressions] = useState<Expression[]>([])
  const [createOrModifyId, setCreateOrModifyId] = useState<number | null | undefined>(null); // null: popin close, undefined : creation, number : id de l'expression
  const [form] = Form.useForm<RowType>();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [textFilter, setTextFilter] = useState<string>('')

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
    if (createOrModifyId === null) return;
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

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextFilter(event.target.value)
  };

  return (
    <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', padding: '10px', paddingBottom: '20px', gap: '15px' }}>
        <div style={{ flexGrow: 1, gap: '10px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Input value={textFilter} onChange={onChange} placeholder='entrez un filtre textuel ici' style={{maxWidth: 200, minWidth: 150}} />
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
        onOk={() => { form.submit(); setCreateOrModifyId(null) }}
        onCancel={() => setCreateOrModifyId(null)}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <Form form={form} style={{ maxWidth: 600 }} initialValues={INTITIAL_VALUES}
          onFinish={onFinish}
        >
          <Form.Item<RowType> label="Texte" name="text" rules={[{ required: true, message: 'Merci de saisir le texte' }]} >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item<RowType> label="Auteur" name="author" >
            <Input />
          </Form.Item>
          <Form.Item<RowType> label="Contexte" name="info" >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
