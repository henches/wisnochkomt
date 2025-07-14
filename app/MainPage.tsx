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

export interface MainPage {
  gridRef: React.RefObject<AgGridReact | null>,
  refreshRef: React.RefObject<VoidFunction | null>
}

export default function MainPage(props: MainPage) {
  const [expressions, setExpressions] = useState<Expression[]>([])
  const [createOrModifyId, setCreateOrModifyId] = useState<number | null | undefined>(null); // null: popin close, undefined : creation, number : id de l'expression
  const [form] = Form.useForm<RowType>();
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const refresh = useCallback(async () => {
    const _expressions = await getExpressionsAction()
    console.log("🚀 ~ refresh ~ _expressions:", _expressions)
    setExpressions(_expressions)
  }, []);

  useEffect(() => {
    props.refreshRef.current = refresh
  }, [props.refreshRef, refresh]);

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
    console.log("🚀 ~ constonFinish:FormProps<FieldType>['onFinish']= ~ expression:", expression)
    const result = await (createOrModifyId === undefined ?
      createExpressionAction(expression) :
      modifyExpressionAction(createOrModifyId, expression));
    message.success(createOrModifyId === undefined ? "Crée" : "Modifié");
    console.log("🚀 ~ constonFinish:FormProps<FieldType>['onFinish']= ~ result:", result)
    if (result.message) {
      refresh();
    }
  };

  return (
    <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', padding: '10px', gap: '15px' }}>
        <div style={{ flexGrow: 1 }}>
          <ExpressionsGrid
            gridRef={props.gridRef as React.RefObject<AgGridReact>}
            expressions={expressions}
            refresh={refresh}
            actOnRowClick={setCreateOrModifyId} />
        </div>
        <Button onClick={() => setCreateOrModifyId(undefined)}>
          <PlusIcon />
        </Button>
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
            <TextArea rows={2} />
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
