"use client"
import { Expression } from "@/types/Expression";
import '@ant-design/v5-patch-for-react-19';
import { Button, Form, FormProps, Input, Modal } from 'antd';
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import "tailwindcss";
import { createExpressionAction, getExpressionsAction } from "./admin/expressions/expressions.action";
import { ExpressionsGrid } from "./admin/ExpressionsGrid";

type FieldType = {
  text?: string;
  info?: string;
};

export default function Home() {
  const [expressions, setExpressions] = useState<Expression[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [form] = Form.useForm<FieldType>();
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const refresh = useCallback(async () => {
    const _expressions = await getExpressionsAction()
    console.log("🚀 ~ refresh ~ _expressions:", _expressions)
    setExpressions(_expressions)
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh])

  const onFinish: FormProps<FieldType>['onFinish'] = async (values: FieldType) => {
    const expression: Expression = {
      text: values.text ?? '',
      info: values.info ?? ''
    }
    console.log("🚀 ~ constonFinish:FormProps<FieldType>['onFinish']= ~ expression:", expression)
    const result = await createExpressionAction(expression);
    console.log("🚀 ~ constonFinish:FormProps<FieldType>['onFinish']= ~ result:", result)
    if (result.message) {
      refresh();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '10px', gap: '15px' }}>
      <ExpressionsGrid expressions={expressions} refresh={refresh} />
      <Button onClick={() => setIsOpen(true)}>
        <PlusIcon />
      </Button>
      <Modal
        open={isOpen}
        title="Ajouter une expression"
        onOk={() => form.submit()}
        onCancel={() => setIsOpen(false)}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <Form form={form} style={{ maxWidth: 600 }} initialValues={{ remember: true }}
          onFinish={onFinish}
        // onFinishFailed={onFinishFailed} 
        >
          <Form.Item<FieldType> label="Texte" name="text" rules={[{ required: true, message: 'Merci de saisir le texte' }]} >
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label="Infos" name="info" >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
