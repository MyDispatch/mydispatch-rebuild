# 📥📤 UNIVERSAL DOWNLOAD/UPLOAD GUIDE

**Version:** V1.0  
**Datum:** 2025-10-29  
**Phase:** 4 - Download/Upload Unification

---

## 🎯 ÜBERSICHT

**UniversalDownload** und **UniversalUpload** sind die **EINZIGEN** Components für Downloads und Uploads im gesamten System.

**REGEL:** NIEMALS custom Download/Upload-Logic implementieren!

---

## 📥 UNIVERSAL DOWNLOAD

### **Import**

```typescript
import { UniversalDownload } from "@/components/shared/UniversalDownload";
import type { DownloadType } from "@/components/shared/UniversalDownload";
```

---

### **Basic Usage**

```typescript
<UniversalDownload
  type="csv"
  data={customers}
  filename="customers-export"
  buttonLabel="Kunden exportieren"
/>
```

---

### **Props**

| Prop           | Type                                               | Required | Default                    | Description                  |
| -------------- | -------------------------------------------------- | -------- | -------------------------- | ---------------------------- |
| `type`         | `'pdf' \| 'csv' \| 'json' \| 'zip' \| 'xlsx'`      | ✅ Yes   | -                          | Download type                |
| `data`         | `any`                                              | ✅ Yes   | -                          | Data to export               |
| `filename`     | `string`                                           | ❌ No    | `'export'`                 | Filename (without extension) |
| `buttonLabel`  | `string`                                           | ❌ No    | `'Als {TYPE} exportieren'` | Button label                 |
| `variant`      | `'default' \| 'outline' \| 'ghost' \| 'secondary'` | ❌ No    | `'outline'`                | Button variant               |
| `showProgress` | `boolean`                                          | ❌ No    | `true`                     | Show progress indicator      |
| `className`    | `string`                                           | ❌ No    | -                          | Custom classes               |
| `portal`       | `'entrepreneur' \| 'customer' \| 'driver'`         | ❌ No    | -                          | Portal-specific theming      |
| `size`         | `'default' \| 'sm' \| 'lg' \| 'icon'`              | ❌ No    | `'default'`                | Button size                  |
| `disabled`     | `boolean`                                          | ❌ No    | `false`                    | Disabled state               |
| `onExport`     | `() => Promise<void>`                              | ❌ No    | -                          | Custom export function       |

---

### **Supported Download Types**

#### **1. CSV Export**

```typescript
<UniversalDownload
  type="csv"
  data={[
    { id: 1, name: 'Max Mustermann', email: 'max@example.com' },
    { id: 2, name: 'Anna Schmidt', email: 'anna@example.com' },
  ]}
  filename="customers-2024"
  buttonLabel="Als CSV exportieren"
/>
```

**Features:**

- ✅ Automatic header detection
- ✅ BOM for Excel compatibility
- ✅ Semicolon delimiter (`;`)
- ✅ Escape quotes and commas

---

#### **2. JSON Export**

```typescript
<UniversalDownload
  type="json"
  data={{ users: customers, timestamp: new Date() }}
  filename="customers-backup"
  buttonLabel="Als JSON exportieren"
/>
```

**Features:**

- ✅ Pretty-printed (2 spaces)
- ✅ Full object/array support
- ✅ Nested structures

---

#### **3. PDF Export** (TODO)

```typescript
<UniversalDownload
  type="pdf"
  data={invoice}
  filename="rechnung-2024-001"
  buttonLabel="Als PDF exportieren"
/>
```

**Status:** ⏳ Not implemented yet (requires jsPDF)

---

#### **4. XLSX Export** (TODO)

```typescript
<UniversalDownload
  type="xlsx"
  data={customers}
  filename="customers-export"
  buttonLabel="Als Excel exportieren"
/>
```

**Status:** ⏳ Not implemented yet (requires xlsx library)

---

### **Portal-Specific Theming**

```typescript
// Unternehmer-Dashboard (Blue)
<UniversalDownload
  type="csv"
  data={data}
  portal="entrepreneur"
/>

// Kundenportal (Beige)
<UniversalDownload
  type="csv"
  data={data}
  portal="customer"
/>

// Fahrerportal (Purple)
<UniversalDownload
  type="csv"
  data={data}
  portal="driver"
/>
```

---

### **Custom Export Function**

```typescript
<UniversalDownload
  type="pdf"
  data={invoice}
  onExport={async () => {
    const pdf = await generateInvoicePDF(invoice);
    await downloadPDF(pdf, 'rechnung.pdf');
  }}
  buttonLabel="Rechnung herunterladen"
/>
```

---

## 📤 UNIVERSAL UPLOAD

### **Import**

```typescript
import { UniversalUpload } from "@/components/shared/UniversalUpload";
```

---

### **Basic Usage**

```typescript
<UniversalUpload
  accept={['image/*', '.pdf']}
  maxSize={5}
  onUpload={async (files) => {
    await uploadToSupabase(files);
  }}
  dragAndDrop
  showPreview
/>
```

---

### **Props**

| Prop          | Type                                       | Required | Default             | Description             |
| ------------- | ------------------------------------------ | -------- | ------------------- | ----------------------- |
| `accept`      | `string[]`                                 | ✅ Yes   | -                   | Accepted file types     |
| `maxSize`     | `number`                                   | ✅ Yes   | -                   | Max file size in MB     |
| `onUpload`    | `(files: File[]) => Promise<void>`         | ✅ Yes   | -                   | Upload handler          |
| `maxFiles`    | `number`                                   | ❌ No    | `1`                 | Max number of files     |
| `dragAndDrop` | `boolean`                                  | ❌ No    | `true`              | Enable drag & drop      |
| `showPreview` | `boolean`                                  | ❌ No    | `true`              | Show file preview       |
| `className`   | `string`                                   | ❌ No    | -                   | Custom classes          |
| `portal`      | `'entrepreneur' \| 'customer' \| 'driver'` | ❌ No    | -                   | Portal-specific theming |
| `disabled`    | `boolean`                                  | ❌ No    | `false`             | Disabled state          |
| `buttonLabel` | `string`                                   | ❌ No    | `'Datei auswählen'` | Button label            |
| `description` | `string`                                   | ❌ No    | -                   | Description text        |

---

### **File Type Filtering**

```typescript
// Images only
<UniversalUpload
  accept={['image/*']}
  maxSize={5}
  onUpload={uploadImages}
/>

// PDFs only
<UniversalUpload
  accept={['.pdf']}
  maxSize={10}
  onUpload={uploadPDFs}
/>

// Multiple types
<UniversalUpload
  accept={['image/*', '.pdf', '.doc', '.docx']}
  maxSize={5}
  onUpload={uploadDocuments}
/>
```

---

### **Multiple Files**

```typescript
<UniversalUpload
  accept={['image/*']}
  maxSize={5}
  maxFiles={3}
  onUpload={async (files) => {
    // files: File[] (up to 3 files)
    for (const file of files) {
      await uploadFile(file);
    }
  }}
/>
```

---

### **Drag & Drop**

```typescript
<UniversalUpload
  accept={['image/*', '.pdf']}
  maxSize={5}
  dragAndDrop // Enable drag & drop area
  onUpload={uploadFiles}
/>
```

---

### **Upload to Supabase**

```typescript
import { supabase } from '@/integrations/supabase/client';

<UniversalUpload
  accept={['image/*', '.pdf']}
  maxSize={5}
  onUpload={async (files) => {
    for (const file of files) {
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(`${Date.now()}-${file.name}`, file);

      if (error) throw error;
    }
  }}
/>
```

---

### **Portal-Specific Theming**

```typescript
// Unternehmer-Dashboard (Blue)
<UniversalUpload
  accept={['image/*']}
  maxSize={5}
  portal="entrepreneur"
  onUpload={uploadFiles}
/>

// Kundenportal (Beige)
<UniversalUpload
  accept={['image/*']}
  maxSize={5}
  portal="customer"
  onUpload={uploadFiles}
/>

// Fahrerportal (Purple)
<UniversalUpload
  accept={['image/*']}
  maxSize={5}
  portal="driver"
  onUpload={uploadFiles}
/>
```

---

## 🚨 CRITICAL RULES

### **❌ VERBOTEN:**

```typescript
// ❌ Custom Download-Logic
const downloadCSV = () => {
  const csv = convertToCSV(data);
  const blob = new Blob([csv]);
  // ... custom download logic
};

// ❌ Custom Upload-Logic
const handleFileUpload = (e) => {
  const file = e.target.files[0];
  // ... custom upload logic
};
```

### **✅ RICHTIG:**

```typescript
// ✅ Universal Download
<UniversalDownload type="csv" data={data} />

// ✅ Universal Upload
<UniversalUpload
  accept={['image/*']}
  maxSize={5}
  onUpload={uploadFiles}
/>
```

---

## 🎯 SUCCESS CRITERIA

- ✅ **KEINE custom** Download/Upload-Logic
- ✅ **Alle Downloads** via `UniversalDownload`
- ✅ **Alle Uploads** via `UniversalUpload`
- ✅ **Portal-Theming** überall konsistent
- ✅ **Type-Safe** Handlers

---

**LAST UPDATE:** 2025-10-29  
**STATUS:** ✅ Produktionsreif  
**USAGE:** Mandatory für alle Downloads/Uploads
