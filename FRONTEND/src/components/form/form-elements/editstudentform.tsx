
import Label from "../Label";
import Input from "../input/InputField";
import DatePicker from "../date-picker.tsx";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Upload from "../../../icons/Upload icon.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';


type StudentFormData = {
  name: string;
  last_name: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  alt_phone: string;
  aadhar_number: string;
  pan_number: string;
  address: string;
  pincode: string;
  state: string;
  department: string;
  course: string;
  year_of_passed: string;
  experience: string;
  department_stream: string;
  course_duration: string;
  join_date: string;
  end_date: string;
  course_enrolled: string;
  batch: string;
  tutor: string;
  // certificate_status: string;
  // Old files (Receiving)
  pan_card_url?: string;
  aadhar_card_url?: string;
  sslc_marksheet_url?: string;
  passport_photo_url?: string;
  // New files (for upload)
  pan_card?: File | null;
  aadhar_card?: File | null;
  sslc_marksheet?: File | null;
  passport_photo?: File | null;
};


export default function StudentEditForm() {

  const [formData, setFormData] = useState<StudentFormData>({
    name: "",
    last_name: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    alt_phone: "",
    aadhar_number: "",
    pan_number: "",
    address: "",
    pincode: "",
    state: "",
    department: "",
    course: "",
    year_of_passed: "",
    experience: "",
    department_stream: "",
    course_duration: "",
    join_date: "",
    end_date: "",
    course_enrolled: "",
    batch: "",
    tutor: "",
    // certificate_status: "",
    pan_card_url: "",
    aadhar_card_url: "",
    sslc_marksheet_url: "",
    passport_photo_url: ""
  });

  const { id } = useParams();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `https://nystai-backend.onrender.com/single-student/${id}`
        );
        const student = res.data.data; // ✅ Fix this line

        setFormData({
          name: student.name ?? "",
          last_name: student.last_name ?? "",
          dob: student.dob ?? "",
          gender: student.gender ?? "",
          email: student.email ?? "",
          phone: student.phone ?? "",
          alt_phone: student.alt_phone ?? "",
          aadhar_number: student.aadhar_number ?? "",
          pan_number: student.pan_number ?? "",
          address: student.address ?? "",
          pincode: student.pincode ?? "",
          state: student.state ?? "",
          department: student.department ?? "",
          course: student.course ?? "",
          year_of_passed: student.year_of_passed ?? "",
          experience: student.experience ?? "",
          department_stream: student.department_stream ?? "",
          course_duration: student.course_duration ?? "",
          join_date: student.join_date ?? "",
          end_date: student.end_date ?? "",
          course_enrolled: student.course_enrolled ?? "",
          batch: student.batch ?? "",
          tutor: student.tutor ?? "",
          // certificate_status: student.certificate_status ?? "",
          pan_card_url: student.pan_card_url ?? "",
          aadhar_card_url: student.aadhar_card_url ?? "",
          sslc_marksheet_url: student.sslc_marksheet_url ?? "",
          passport_photo_url: student.passport_photo_url ?? ""
        });
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudent();
  }, [id]);

  console.log("FormData after fetch:", formData);

  const handleSubmit = async () => {
    try {
      const payload = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          typeof value !== "object" // avoid appending [object Object]
        ) {
          payload.append(key, value as string);
        }
      });

      // Append files with exact field names
      if (formData.pan_card instanceof File)
        payload.append("pan_card", formData.pan_card);
      if (formData.aadhar_card instanceof File)
        payload.append("aadhar_card", formData.aadhar_card);
      if (formData.sslc_marksheet instanceof File)
        payload.append("sslc_marksheet", formData.sslc_marksheet);
      if (formData.passport_photo instanceof File)
        payload.append("passport_photo", formData.passport_photo);

      await axios.put(
        `https://nystai-backend.onrender.com/update-student/${id}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Student updated!");
    } catch (error) {
      toast.error("Failed to update student");
    }
  };

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
                  <Input
                    placeholder="John"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Last Name</Label>
                <div className="relative">
                  <Input placeholder="Doe" type="text" className=""
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <DatePicker
                  id="dob"
                  label="Date Of Birth"
                  placeholder="Select date of birth"
                  maxDate={new Date(new Date().setFullYear(new Date().getFullYear() - 21))}
                  value={
                    formData.dob && !isNaN(Date.parse(formData.dob))
                      ? new Date(formData.dob)
                      : undefined
                  }
                  onChange={(date) => {
                    const selectedDate = Array.isArray(date) ? date[0] : date;

                    if (selectedDate) {
                      const year = selectedDate.getFullYear();
                      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                      const day = String(selectedDate.getDate()).padStart(2, "0");

                      setFormData({
                        ...formData,
                        dob: `${year}-${month}-${day}`, // ✅ Exact date, no UTC shift
                      });
                    } else {
                      setFormData({
                        ...formData,
                        dob: "",
                      });
                    }
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
                    options={["Male", "Female", "Other"]}
                    selected={formData.gender as "Male" | "Female" | "Other"}
                    onSelect={(value) => setFormData({ ...formData, gender: value })}
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
                  <Input placeholder="info@gmail.com" type="email" className=""
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Phone Number</Label>
                <div className="relative">
                  <Input placeholder="9876543210" type="tel" className=""
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Alternate Phone</Label>
                <div className="relative">
                  <Input placeholder="9876543211" type="tel" className=""
                    value={formData.alt_phone}
                    onChange={(e) => setFormData({ ...formData, alt_phone: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Aadhar Number</Label>
                <div className="relative">
                  <Input placeholder="XXXX-XXXX-XXXX" type="text" className=""
                    value={formData.aadhar_number}
                    onChange={(e) => setFormData({ ...formData, aadhar_number: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
            <div className="space-y-6">
              <div>
                <Label>PAN Number</Label>
                <div className="relative">
                  <Input placeholder="ABCDE1234F" type="text" className=""
                    value={formData.pan_number}
                    onChange={(e) => setFormData({ ...formData, pan_number: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Address</Label>
                <div className="relative">
                  <Input placeholder="123 Street, City" type="text" className=""
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Pincode</Label>
                <div className="relative">
                  <Input placeholder="600001" type="text" className=""
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>State</Label>
                <div className="relative">
                  <Input placeholder="Tamil Nadu" type="text" className=""
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
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
                  <Input placeholder="Department Name" type="text" className=""
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Course */}
            <div className="space-y-6">
              <div>
                <Label>Course</Label>
                <div className="relative">
                  <Input placeholder="Course Name" type="text" className=""
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Year Of Passed */}
            <div className="space-y-6">
              <div>
                <Label>Year Of Passed</Label>
                <div className="relative">
                  <Input placeholder="e.g. 2022" type="text" className=""
                    value={formData.year_of_passed}
                    onChange={(e) => setFormData({ ...formData, year_of_passed: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-6">
              <div>
                <Label>Experience</Label>
                <div className="relative">
                  <Input placeholder="e.g. 2 years" type="text" className=""
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })} />
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
                  <Input placeholder="John" type="text" className=""
                    value={formData.department_stream}
                    onChange={(e) => setFormData({ ...formData, department_stream: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Course Duration</Label>
                <div className="relative">
                  <Input placeholder="Doe" type="text" className=""
                    value={formData.course_duration}
                    onChange={(e) => setFormData({ ...formData, course_duration: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="space-y-6">
                  <div>
                    <DatePicker
                      id="join-date"
                      label="Join Date"
                      placeholder="Select a date"
                      value={
                        formData.join_date && !isNaN(Date.parse(formData.join_date))
                          ? new Date(formData.join_date)
                          : undefined
                      }
                      onChange={(date) => {
                        const selectedDate = Array.isArray(date) ? date[0] : date;

                        if (selectedDate) {
                          const year = selectedDate.getFullYear();
                          const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                          const day = String(selectedDate.getDate()).padStart(2, "0");

                          setFormData({
                            ...formData,
                            join_date: `${year}-${month}-${day}`,
                          });
                        } else {
                          setFormData({
                            ...formData,
                            join_date: "",
                          });
                        }
                      }}

                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <DatePicker
                  id="end-date"
                  label="End Date"
                  placeholder="Select a date"
                  value={
                    formData.end_date && !isNaN(Date.parse(formData.end_date))
                      ? new Date(formData.end_date)
                      : undefined
                  }
                  // onChange={(date) => {
                  //   const selectedDate = Array.isArray(date) ? date[0] : date;
                  //   setFormData({
                  //     ...formData,
                  //     end_date: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
                  //   });
                  // }}
                  onChange={(date) => {
                    const selectedDate = Array.isArray(date) ? date[0] : date;

                    if (selectedDate) {
                      const year = selectedDate.getFullYear();
                      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                      const day = String(selectedDate.getDate()).padStart(2, "0");

                      setFormData({
                        ...formData,
                        end_date: `${year}-${month}-${day}`,
                      });
                    } else {
                      setFormData({
                        ...formData,
                        end_date: "",
                      });
                    }
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
                  <Input placeholder="Course Name" type="text" className=""
                    value={formData.course_enrolled}
                    onChange={(e) => setFormData({ ...formData, course_enrolled: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Batch */}
            <div className="space-y-6">
              <div>
                <Label>Batch</Label>
                <div className="relative">
                  <Input placeholder="e.g. 2022-2023" type="text" className=""
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Tutor */}
            <div className="space-y-6">
              <div>
                <Label>Tutor</Label>
                <div className="relative">
                  <CustomDropdown
                    options={["Mohamed Yusuf Deen", "Sivaguru", "Others"]}
                    selected={formData.tutor as "Mohamed Yusuf Deen" | "Sivaguru" | "Others"}
                    onSelect={(value) => setFormData({ ...formData, tutor: value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
            <div className="space-y-6">
              <div>
                <Label>Certificate Status</Label>
                <div className="relative">
                  <CustomDropdown
                    options={["completed", "pending"]}
                    selected={formData.certificate_status as "completed" | "pending"}
                    onSelect={(value) => setFormData({ ...formData, certificate_status: value })}
                  />
                </div>
              </div>
            </div>
          </div> */}

          {/* Heading design */}
          <h3 className="text-l font-semibold text-[#202224] dark:text-white/90 py-4">
            Upload Documents
          </h3>

          {/* UPLOAD IMAGE  */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <Label>Pan Card</Label>
              <FileUploadBox
                defaultFile={formData.pan_card_url}
                onFileChange={(file) =>
                  setFormData((prev) => ({ ...prev, pan_card: file }))
                }
              />
            </div>
            <div className="space-y-6">
              <Label>Aadhar Card</Label>
              <FileUploadBox
                defaultFile={formData.aadhar_card_url}
                onFileChange={(file) =>
                  setFormData((prev) => ({ ...prev, aadhar_card: file }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <Label>SSLC Marksheet</Label>
              <FileUploadBox
                defaultFile={formData.sslc_marksheet_url}
                onFileChange={(file) =>
                  setFormData((prev) => ({ ...prev, sslc_marksheet: file }))
                }
              />
            </div>
            <div className="space-y-6">
              <Label>Passport Size Photo</Label>
              <FileUploadBox
                defaultFile={formData.passport_photo_url}
                onFileChange={(file) =>
                  setFormData((prev) => ({ ...prev, passport_photo: file }))
                }
              />
            </div>
          </div>

          {/* BTN  */}
          <div className="grid xl:grid-cols-2 gap-6">
            <div className="col-span-full flex justify-center">
              <button
                onClick={handleSubmit}
                className="flex items-center justify-center px-32 py-3 font-medium text-dark rounded-lg bg-[#F8C723] text-theme-sm hover:bg-brand-600"
              >
                UPDATE STUDENT
              </button>
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
  selected?: T;
};

function CustomDropdown<T extends string>({
  label = "Select",
  options = [],
  onSelect,
  selected,
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
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

type FileUploadBoxProps = {
  defaultFile?: string; // for edit mode (URL or file name)
  onFileChange?: (file: File | null) => void;
};

function FileUploadBox({ defaultFile, onFileChange }: FileUploadBoxProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (defaultFile) {
      setPreviewUrl(defaultFile);
    }
  }, [defaultFile]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      onFileChange?.(file); // ✅ send file to parent
    }
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleDelete = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onFileChange?.(null);
  };

  const fileName = selectedFile?.name || (defaultFile ? defaultFile.split("/").pop() : "");
  const fileSizeMB = selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(1) : null;

  if (previewUrl) {
    return (
      <div className="bg-white flex justify-between items-center px-4 py-3 rounded-xl shadow border h-[176px]">
        <div className="flex items-center gap-4">
          <div>
            <img
              src={previewUrl}
              alt="Preview"
              className="h-12 w-12 object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{fileName}</p>
            <p className="text-xs text-gray-500">
              {fileSizeMB ? `${fileSizeMB} MB` : "Uploaded"}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-500 hover:text-red-500 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500 h-[176px]">
      <form
        {...getRootProps()}
        className={`dropzone h-full rounded-xl border-dashed border-gray-300 p-7 lg:p-10
        ${isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"}`}
        id="demo-upload"
      >
        <input {...getInputProps()} />
        <div className="dz-message flex flex-row items-center m-0 gap-6 h-full">
          <div className="flex justify-center items-center shrink-0">
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full text-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <img src={Upload} alt="Upload Icon" className="h-12 w-12 object-contain" />
            </div>
          </div>
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


