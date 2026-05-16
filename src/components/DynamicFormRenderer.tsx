import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Upload, Image as ImageIcon, Ruler } from 'lucide-react';

export interface DynamicField {
  id: string;
  _id?: string;
  label: string;
  name: string;
  type: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface DynamicFormRendererProps {
  fields: DynamicField[];
}

export const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({ fields }) => {
  const { register, formState: { errors } } = useFormContext();

  const renderField = (field: DynamicField) => {
    const error = errors[field.name];

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...register(field.name, { required: field.required })}
            placeholder={field.placeholder}
            className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#c99f2b] outline-none min-h-[120px] shadow-sm"
          />
        );

      case 'select':
        return (
          <select
            {...register(field.name, { required: field.required })}
            className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#c99f2b] outline-none shadow-sm appearance-none cursor-pointer"
          >
            <option value="">Select an option</option>
            {field.options?.map((opt, idx) => (
              <option key={`${opt}-${idx}`} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="grid grid-cols-2 gap-3">
            {field.options?.map((opt, idx) => (
              <label key={`${opt}-${idx}`} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all shadow-sm">
                <input
                  type="radio"
                  value={opt}
                  {...register(field.name, { required: field.required })}
                  className="w-4 h-4 text-[#c99f2b] focus:ring-[#c99f2b]"
                />
                <span className="text-sm font-medium text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="grid grid-cols-2 gap-3">
            {field.options?.map((opt, idx) => (
              <label key={`${opt}-${idx}`} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all shadow-sm">
                <input
                  type="checkbox"
                  value={opt}
                  {...register(field.name, { required: field.required })}
                  className="w-4 h-4 rounded text-[#c99f2b] focus:ring-[#c99f2b]"
                />
                <span className="text-sm font-medium text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        );

      case 'color':
        return (
          <div className="flex items-center gap-4">
            <input
              type="color"
              {...register(field.name, { required: field.required })}
              className="w-12 h-12 rounded-xl border-none p-0 cursor-pointer overflow-hidden"
            />
            <span className="text-sm text-gray-500 font-medium">Pick a color</span>
          </div>
        );

      case 'image':
      case 'file':
        return (
          <div className="relative">
            <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:bg-gray-50 hover:border-[#c99f2b]/30 transition-all group shadow-sm bg-white">
              <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-[#c99f2b]/10 transition-colors">
                {field.type === 'image' ? <ImageIcon className="text-[#c99f2b]" /> : <Upload className="text-[#c99f2b]" />}
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">Click to upload {field.type}</p>
                <p className="text-xs text-gray-400 mt-1">Maximum file size: 5MB</p>
              </div>
              <input
                type="file"
                accept={field.type === 'image' ? "image/*" : "*"}
                {...register(field.name, { required: field.required })}
                className="hidden"
              />
            </label>
          </div>
        );

      case 'dimension':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">Width</span>
              <input
                type="number"
                {...register(`${field.name}_width`, { required: field.required })}
                placeholder="0.00"
                className="w-full pl-16 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#c99f2b] outline-none shadow-sm"
              />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">Height</span>
              <input
                type="number"
                {...register(`${field.name}_height`, { required: field.required })}
                placeholder="0.00"
                className="w-full pl-16 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#c99f2b] outline-none shadow-sm"
              />
            </div>
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            {...register(field.name, { required: field.required })}
            placeholder={field.placeholder}
            className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#c99f2b] outline-none shadow-sm"
          />
        );

      default:
        return (
          <input
            type="text"
            {...register(field.name, { required: field.required })}
            placeholder={field.placeholder}
            className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#c99f2b] outline-none shadow-sm"
          />
        );
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      {fields.map((field, index) => (
        <div key={field._id || field.id || `${field.name}-${index}`} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
          </div>
          {renderField(field)}
          {errors[field.name] && (
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1">
              This field is required
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
