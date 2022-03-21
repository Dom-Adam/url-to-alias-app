import { useState } from "react";
import "./App.css";
import { Button, Form, Input } from "antd";
import "antd/dist/antd.css";
import { useForm } from "antd/lib/form/Form";
import { EntryExisted, ServerUrl, WriteSuccessfull } from "./constants";

interface MessageModel {
  success: boolean | null;
  alias?: string;
  url?: string;
}

const regexValidator = (rule: string): boolean => {
  const regex = new RegExp(/[0-9a-zA-Z]/);
  return regex.test(rule);
};

const Message = ({ success, alias, url }: MessageModel) => {
  if (success) {
    return (
      <p>
        link was successfully created <a href={url}>{alias}</a>
      </p>
    );
  } else if (success == false) {
    return <p role="alert">request failed</p>;
  }

  return null;
};

function App() {
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const [message, setMessage] = useState<MessageModel>({ success: null });

  const submit = async (payload: any) => {
    setLoading(true);

    try {
      const reponse = await fetch(ServerUrl, {
        body: JSON.stringify(payload),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const resJson = await reponse.json();

      if (resJson.msg == EntryExisted) {
        form.setFields([{ name: "alias", errors: [resJson.msg] }]);
        setMessage({ success: null });
      } else if (resJson.msg == WriteSuccessfull) {
        setMessage({ success: true, alias: resJson.alias, url: resJson.url });
        form.resetFields();
      } else {
        setMessage({ success: false });
      }
    } catch (e) {
      setMessage({ success: false });
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="form">
        <Form form={form} layout="vertical" onFinish={submit}>
          <Form.Item
            label="Url"
            name="url"
            hasFeedback
            rules={[
              {
                required: true,
                message: "is required",
              },
              {
                type: "url",
                message: "needs to be valid url format",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Alias"
            name="alias"
            hasFeedback
            rules={[
              {
                pattern: /^[0-9a-zA-Z_-]*$/,
                message:
                  "only alphanumeric characters, dashes, and underscores are allowed",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button disabled={loading} htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="message">
        <Message {...message} />
      </div>
    </div>
  );
}

export default App;
