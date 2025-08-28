"use client"
import { Expression } from '@/types/Expression';
import { UploadOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { Button, message, UploadProps } from 'antd';
import Upload, { UploadChangeParam, UploadFile } from 'antd/es/upload';
import Papa from 'papaparse';
import { importExpressionsAction } from './actions/expressions.action';

interface CsvData {
  [key: string]: string;
}

interface ImportCsvProps {
  actAfterLoad: () => void
}

export const ImportCsv: React.FC<ImportCsvProps> = ({ actAfterLoad }) => {
  const props: UploadProps = {
    name: 'file',
    accept: '.csv',
    showUploadList: false, // Masquer la liste des fichiers téléchargés
    beforeUpload: (file) => {
      console.log("file = ", file)
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        delimiter: ',',
        complete: (results: Papa.ParseResult<CsvData>) => {
          console.log("results = ", results)
          const expressions: Expression[] = results.data.map(csvLine => ({
            // id: parseInt(csvLine.id),
            text: csvLine.text ?? '',
            author: csvLine.author ?? '',
            info: csvLine.info ?? ''
          }))
          importExpressionsAction(expressions.reverse());
          actAfterLoad()
        },
      });
      return false; // Empêcher le téléchargement automatique
    },
    onChange(info: UploadChangeParam<UploadFile>) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        actAfterLoad()
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Télécharger un fichier CSV</Button>
      </Upload>
    </div>
  );
};
