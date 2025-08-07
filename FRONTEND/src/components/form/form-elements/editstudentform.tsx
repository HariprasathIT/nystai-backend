
import Label from "../Label";
import Input from "../input/InputField";
import DatePicker from "../date-picker.tsx";
import {
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Upload from "../../../icons/Upload icon.png";
import Uploadafter from "../../../icons/OIP.webp";

export default function InputGroup() {

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6" >
        <div className="space-y-6" >

          {/* Heading design */}
          <h2
            className="text-xl font-semibold text-gray-800 dark:text-white/90"
            x-text="pageName"
          >
            Edit Student Form
          </h2>

          <h3 className="text-l font-semibold text-[#202224] dark:text-white/90 py-4">
            Personal Details
          </h3>

          {/* input form  */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
            <div className="space-y-6">
              <div>
                <Label>First Name</Label>
                <div className="relative">
                  <Input placeholder="John" type="text" className="" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Last Name</Label>
                <div className="relative">
                  <Input placeholder="Doe" type="text" className="" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <DatePicker
                  id="date-picker"
                  label="Date Of Birth"
                  placeholder="Select a date"
                  onChange={(dates, currentDateString) => {
                    // Handle your logic
                    console.log({ dates, currentDateString });
                  }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>
                  Gender
                </Label>
                <div className="relative">
                  <CustomDropdown
                    options={["Male", "Female", "Other"] as const}
                    onSelect={(value) => console.log("Selected:", value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
            <div className="space-y-6">
              <div>
                <Label>Mail ID</Label>
                <div className="relative">
                  <Input placeholder="info@gmail.com" type="email" className="" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Phone Number</Label>
                <div className="relative">
                  <Input placeholder="9876543210" type="tel" className="" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Alternate Phone</Label>
                <div className="relative">
                  <Input placeholder="9876543211" type="tel" className="" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Aadhar Number</Label>
                <div className="relative">
                  <Input placeholder="XXXX-XXXX-XXXX" type="text" className="" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
            <div className="space-y-6">
              <div>
                <Label>PAN Number</Label>
                <div className="relative">
                  <Input placeholder="ABCDE1234F" type="text" className="" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Address</Label>
                <div className="relative">
                  <Input placeholder="123 Street, City" type="text" className="" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Pincode</Label>
                <div className="relative">
                  <Input placeholder="600001" type="text" className="" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>State</Label>
                <div className="relative">
                  <Input placeholder="Tamil Nadu" type="text" className="" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
            {/* Department */}
            <div className="space-y-6">
              <div>
                <Label>Department</Label>
                <div className="relative">
                  <Input placeholder="Department Name" type="text" className="" />
                </div>
              </div>
            </div>

            {/* Course */}
            <div className="space-y-6">
              <div>
                <Label>Course</Label>
                <div className="relative">
                  <Input placeholder="Course Name" type="text" className="" />
                </div>
              </div>
            </div>

            {/* Year Of Passed */}
            <div className="space-y-6">
              <div>
                <Label>Year Of Passed</Label>
                <div className="relative">
                  <Input placeholder="e.g. 2022" type="text" className="" />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-6">
              <div>
                <Label>Experience</Label>
                <div className="relative">
                  <Input placeholder="e.g. 2 years" type="text" className="" />
                </div>
              </div>
            </div>
          </div>

          {/* Heading design */}
          <h3 className="text-l font-semibold text-[#202224] dark:text-white/90 py-4">
            Academic & Course Details
          </h3>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
            <div className="space-y-6">
              <div>
                <Label>Department / Stream</Label>
                <div className="relative">
                  <Input placeholder="John" type="text" className="" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Course Duration</Label>
                <div className="relative">
                  <Input placeholder="Doe" type="text" className="" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="space-y-6">
                  <div>
                    <DatePicker
                      id="date-picker"
                      label="Join Date"
                      placeholder="Select a date"
                      onChange={(dates, currentDateString) => {
                        // Handle your logic
                        console.log({ dates, currentDateString });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <DatePicker
                  id="date-picker"
                  label="End Date"
                  placeholder="Select a date"
                  onChange={(dates, currentDateString) => {
                    // Handle your logic
                    console.log({ dates, currentDateString });
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
            {/* Course Enrolled */}
            <div className="space-y-6">
              <div>
                <Label>Course Enrolled</Label>
                <div className="relative">
                  <Input placeholder="Course Name" type="text" className="" />
                </div>
              </div>
            </div>

            {/* Batch */}
            <div className="space-y-6">
              <div>
                <Label>Batch</Label>
                <div className="relative">
                  <Input placeholder="e.g. 2022-2023" type="text" className="" />
                </div>
              </div>
            </div>

            {/* Tutor */}
            <div className="space-y-6">
              <div>
                <Label>Tutor</Label>
                <div className="relative">
                  <CustomDropdown
                    options={["Male", "Female", "Other"]}
                    onSelect={(value) => console.log("Selected:", value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Heading design */}
          <h3 className="text-l font-semibold text-[#202224] dark:text-white/90 py-4">
            Upload Documents
          </h3>


          {/* UPLOAD IMAGE  */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <Label> Pan Card</Label>
              <FileUploadBox />
            </div>
            <div className="space-y-6">
              <Label>Aadhar Card</Label>
              <FileUploadBox />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <Label> SSLC Marksheet</Label>
              <FileUploadBox />
            </div>
            <div className="space-y-6">
              <Label> Passport Size Photo</Label>
              <FileUploadBox />
            </div>
          </div>

          {/* BTN  */}
          <div className="grid xl:grid-cols-2 gap-6">
            <div className="col-span-full flex justify-center">
              <a
                href="/add-admin"
                className="flex items-center justify-center px-32 py-3 font-medium text-dark rounded-lg bg-[#F8C723] text-theme-sm hover:bg-brand-600"
              >
                CLICK TO REGISTER
              </a>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

// DROPDOWN COMPONENT 

type CustomDropdownProps<T extends string> = {
  label?: string;
  options: T[];
  onSelect?: (value: T) => void;
};

function CustomDropdown<T extends string>({
  label = "Select",
  options = [],
  onSelect,
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<T | "">("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: T) => {
    setSelected(value);
    setIsOpen(false);
    onSelect?.(value);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="peer w-full appearance-none rounded-md border border-gray-300 bg-[#F5F5F5] px-4 pr-10 py-2.5 text-left text-gray-700 
        focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
      >
        {selected || label}
      </button>

      {/* Dropdown Icon */}
      <span
        className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
          }`}
      >
        <FontAwesomeIcon icon={faChevronDown} />
      </span>

      {/* Dropdown List */}
      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg">
          {options.map((opt, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(opt)}
              className="cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


import { useCallback } from "react";
import { Trash2 } from "lucide-react";

function FileUploadBox() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleDelete = () => setSelectedFile(null);

  // Render uploaded file preview card
  if (selectedFile) {
    const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(1);


    return (
      <div className="bg-white flex justify-between items-center px-4 py-3 rounded-xl shadow border h-[176px]">
        <div className="flex items-center gap-4">
          {/* File icon */}
          <div className="">
            <img
              src={Uploadafter}
              alt="Preview"
              className="h-12 w-12 object-contain"
            />
          </div>
          {/* File name and size */}
          <div>
            <p className="text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">{fileSizeMB} MB</p>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="text-gray-500 hover:text-red-500 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    );
  }

  // Render upload dropzone
  return (
    <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500 h-[176px]">
      <form
        {...getRootProps()}
        className={`dropzone h-full rounded-xl border-dashed border-gray-300 p-7 lg:p-10
      ${isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"}
    `}
        id="demo-upload"
      >
        <input {...getInputProps()} />
        <div className="dz-message flex flex-row items-center m-0 gap-6 h-full">
          {/* Icon Container */}
          <div className="flex justify-center items-center shrink-0">
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full text-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <img src={Upload} alt="Upload Icon" className="h-12 w-12 object-contain" />
            </div>
          </div>

          {/* Text Content */}
          <div className="max-w-[400px] text-center">
            <h4 className="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {isDragActive ? "Drop Files or" : "Drag & Drop Files or"}{" "}
              <span className="font-medium underline text-theme-sm text-brand-500">
                Browse File
              </span>
            </h4>
            <span className="block text-sm text-gray-700 dark:text-gray-400">
              Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
            </span>
          </div>
        </div>
      </form>
    </div>

  );
}
