import { GuideSection } from '@/types/guide';

export const guideSections: GuideSection[] = [
  {
    id: 'template',
    title: 'Preparing Your Template',
    description: `Your Word template should contain variables in double curly braces {{like_this}}. These variables must match your Excel/CSV column names exactly (case-sensitive).

For example, if your Excel has columns "First_Name" and "Company_Name", your template should use {{First_Name}} and {{Company_Name}}.`,
    example: {
      template: `Dear {{First_Name}},

We're excited to welcome you to {{Company_Name}}. Your employee ID is {{Employee_ID}}.

Best regards,
HR Team`,
      data: `First_Name,Company_Name,Employee_ID
John,Acme Corp,EMP001
Sarah,Tech Inc,EMP002`
    }
  },
  {
    id: 'data',
    title: 'Preparing Your Data File',
    description: `Create an Excel (.xlsx) file with your data. The column headers will be used as variable names in your template.

Important tips:
- Use simple column names without spaces (use underscores instead)
- Make sure column names match template variables exactly
- Remove any empty rows or columns`,
    example: {
      data: `First_Name | Company_Name | Start_Date  | Salary
John Doe  | Acme Corp   | 2024-04-01 | 50000
Jane Smith| Tech Inc    | 2024-04-15 | 60000`
    }
  },
  {
    id: 'usage',
    title: 'Using the App',
    description: `1. Click "Choose File" under Template Document and select your .docx template
2. Click "Choose File" under Data File and select your Excel file
3. Review the data preview to ensure everything looks correct
4. Click "Generate Documents" to create a document for each row
5. Download the generated ZIP file containing all documents`
  },
  {
    id: 'examples',
    title: 'Common Examples',
    description: `Here are some common use cases:

1. Offer Letters:
   Template: "Dear {{candidate_name}}, We're pleased to offer you the position of {{job_title}} at {{salary}} per year."
   
2. Certificates:
   Template: "This certifies that {{participant_name}} has completed {{course_name}} on {{completion_date}}."
   
3. Invoices:
   Template: "Bill To: {{client_name}}
   Invoice #: {{invoice_number}}
   Amount Due: {{amount}}"`
  }
]; 