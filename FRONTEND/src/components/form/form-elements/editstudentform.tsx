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
import toast from "react-hot-toast";

// Types
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
  pan_card_url?: string;
  aadhar_card_url?: string;
  sslc_marksheet_url?: string;
  passport_photo_url?: string;
  pan_card?: File | null;
  aadhar_card?: File | null;
  sslc_marksheet?: File | null;
  passport_photo?: File | null;
};


type StudentFormErrors = Partial<Record<keyof StudentFormData, string>>;

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

  const [errors, setErrors] = useState<StudentFormErrors>({});
  const { id } = useParams();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `https://nystai-backend.onrender.com/single-student/${id}`
        );
        const student = res.data.data;
        setFormData({
          ...formData,
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
          pan_card_url: student.pan_card_url ?? "",
          aadhar_card_url: student.aadhar_card_url ?? "",
          sslc_marksheet_url: student.sslc_marksheet_url ?? "",
          passport_photo_url: student.passport_photo_url ?? "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch student data");
      }
    };
    fetchStudent();
  }, [id]);

  const validateForm = (): boolean => {
    const newErrors: StudentFormErrors = {};

    // Name validation
    if (!formData.name.trim()) newErrors.name = "First name is required";
    else if (formData.name.length < 4 || formData.name.length > 30)
      newErrors.name = "Name must be between 4 and 30 characters";
    else if (!/^[A-Za-z]+$/.test(formData.name))
      newErrors.name = "Name must contain only letters";

    // Last name
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    else if (formData.last_name.length > 4)
      newErrors.last_name = "Last name must be at most 4 characters long";
    else if (!/^[A-Za-z]+$/.test(formData.last_name))
      newErrors.last_name = "Last name must contain only letters";

    // DOB
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) age--;
      if (age < 21) newErrors.dob = "Student must be at least 21 years old";
    }

    // Gender
    if (!["Male", "Female", "Other"].includes(formData.gender))
      newErrors.gender = "Invalid gender option";

    // Email
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email";
    else if (!/@(?:gmail\.com|yahoo\.com|outlook\.com|.+\.org)$/.test(formData.email))
      newErrors.email = "Only gmail.com, yahoo.com, outlook.com, or .org emails are allowed";

    // Phone
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone))
      newErrors.phone = "Phone must start with 6-9 and be 10 digits";

    // Alt phone
    if (formData.alt_phone && !/^[6-9]\d{9}$/.test(formData.alt_phone))
      newErrors.alt_phone = "Alt phone must start with 6-9 and be 10 digits";

    // Aadhar
    if (!formData.aadhar_number.trim()) newErrors.aadhar_number = "Aadhar is required";
    else if (!/^\d{12}$/.test(formData.aadhar_number))
      newErrors.aadhar_number = "Aadhar must be 12 digits";

    // PAN
    if (!formData.pan_number.trim()) newErrors.pan_number = "PAN is required";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan_number))
      newErrors.pan_number = "Invalid PAN format";

    // Address
    if (!formData.address.trim()) newErrors.address = "Address is required";

    // Pincode
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^[1-9][0-9]{5}$/.test(formData.pincode))
      newErrors.pincode = "Pincode must be 6 digits starting 1-9";

    // State
    if (!formData.state.trim()) newErrors.state = "State is required";

    // Course details (required fields)
    ["department", "course", "year_of_passed", "experience", "department_stream", "course_duration", "join_date", "end_date", "course_enrolled", "batch", "tutor"].forEach(field => {
      if (!formData[field as keyof StudentFormData]?.toString().trim())
        newErrors[field as keyof StudentFormData] = `${field.replace("_", " ")} is required`;
    });

    // File validation: required + 2MB limit
    ["pan_card", "aadhar_card", "sslc_marksheet", "passport_photo"].forEach((key) => {
      const file = formData[key as keyof StudentFormData] as File | null;
      const url = formData[`${key}_url` as keyof StudentFormData] as string | undefined;
      if (!file && !url) {
        newErrors[key as keyof StudentFormData] = "File is required";
      }
      if (file && file.size > 2 * 1024 * 1024) {
        newErrors[key as keyof StudentFormData] = "File must be less than 2MB";
      }
    });


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = new FormData();

    // Append all fields including File objects
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          payload.append(key, value); // File object
        } else if (typeof value === "string") {
          payload.append(key, value);
        }
      }
    });

    try {
      await axios.put(`https://nystai-backend.onrender.com/update-student/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Student updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update student");
    }
  };

  const [courses, setCourses] = useState<{ id: number; course_name: string }[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "https://nystai-backend.onrender.com/Allcourses/get-all-courses"
        );
        const result = await response.json();
        if (result.success) {
          setCourses(result.data); // set courses into state
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, []);


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
                    onChange={(e) => {
                      const value = e.target.value;
                      const onlyLetters = value.replace(/[^A-Za-z]/g, ''); // removes special chars
                      setFormData({ ...formData, name: onlyLetters });
                    }}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Last Name</Label>
                <div className="relative">
                  <Input placeholder="Doe" type="text" className=""
                    value={formData.last_name}
                    onChange={(e) => {
                      const value = e.target.value;
                      const onlyLetters = value.replace(/[^A-Za-z]/g, ''); // allows only A-Z, a-z
                      setFormData({ ...formData, last_name: onlyLetters });
                    }}
                  />
                  {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
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
                        dob: `${year}-${month}-${day}`, // ✅ Local date, no timezone shift
                      });
                    } else {
                      setFormData({
                        ...formData,
                        dob: "",
                      });
                    }
                  }}
                />
                {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
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
                  {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
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
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Phone Number</Label>
                <div className="relative">
                  <Input placeholder="9876543210" type="tel" className=""
                    value={formData.phone}
                    maxLength={10} // prevents typing more than 10
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // remove non-digits
                      if (value.length <= 10) {
                        setFormData({ ...formData, phone: value });
                      }
                    }} />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Alternate Phone</Label>
                <div className="relative">
                  <Input placeholder="9876543211" type="tel" className=""
                    value={formData.alt_phone}
                    maxLength={10} // restrict typing to 10 digits
                    onChange={(e) => {
                      // allow only numbers & max 10 digits
                      const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setFormData({ ...formData, alt_phone: value });
                    }} />
                  {errors.alt_phone && <p className="text-red-500 text-sm">{errors.alt_phone}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Aadhar Number</Label>
                <div className="relative">
                  <Input placeholder="XXXX-XXXX-XXXX" type="text" className=""
                    value={formData.aadhar_number}
                    maxLength={12} // restricts input to 12 chars
                    onChange={(e) => {
                      // Allow only numbers
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, aadhar_number: value });
                    }} />
                  {errors.aadhar_number && <p className="text-red-500 text-sm">{errors.aadhar_number}</p>}
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
                    maxLength={10} // PAN is exactly 10 chars
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase(); // auto uppercase
                      // allow only alphabets and numbers, no special chars
                      if (/^[A-Z0-9]*$/.test(value)) {
                        setFormData({ ...formData, pan_number: value });
                      }
                    }} />
                  {errors.pan_number && <p className="text-red-500 text-sm">{errors.pan_number}</p>}
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
                  {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Pincode</Label>
                <div className="relative">
                  <Input
                    placeholder="600001"
                    type="text"
                    value={formData.pincode}
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/\D/g, ''); // Remove non-digits including spaces
                      if (onlyNums.length <= 6) {
                        setFormData({ ...formData, pincode: onlyNums });
                      }
                    }}
                  />
                  {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>State</Label>
                <div className="relative">
                  <Input placeholder="Tamil Nadu" type="text" className=""
                    value={formData.state}
                    onChange={(e) => {
                      const onlyChars = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      setFormData({ ...formData, state: onlyChars });
                    }} />
                  {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
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
                    onChange={(e) => {
                      const onlyLettersAndSpaces = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      setFormData({ ...formData, department: onlyLettersAndSpaces });
                    }} />
                  {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
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
                  {errors.course && <p className="text-red-500 text-sm">{errors.course}</p>}
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
                  {errors.year_of_passed && <p className="text-red-500 text-sm">{errors.year_of_passed}</p>}
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
                    onChange={(e) => {
                      const numbersOnly = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, year_of_passed: numbersOnly });
                    }} />
                  {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
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
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[A-Za-z]*$/.test(value)) {
                        setFormData({ ...formData, department_stream: value });
                      }
                    }} />
                  {errors.department_stream && <p className="text-red-500 text-sm">{errors.department_stream}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Course Duration</Label>
                <div className="relative">
                  <Input placeholder="Doe" type="text" className=""
                    value={formData.course_duration}
                    onChange={(e) => {
                      const numbersOnly = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({ ...formData, course_duration: numbersOnly });
                    }} />
                  {errors.course_duration && <p className="text-red-500 text-sm">{errors.course_duration}</p>}
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
                        if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
                          // Format date in local timezone (YYYY-MM-DD)
                          const year = selectedDate.getFullYear();
                          const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                          const day = String(selectedDate.getDate()).padStart(2, "0");
                          const formattedDate = `${year}-${month}-${day}`;

                          setFormData((prev) => ({
                            ...prev,
                            join_date: formattedDate,
                          }));
                        }
                      }}
                    />
                    {errors.join_date && <p className="text-red-500 text-sm">{errors.join_date}</p>}
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
                    if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
                      // Format in local time (YYYY-MM-DD)
                      const year = selectedDate.getFullYear();
                      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                      const day = String(selectedDate.getDate()).padStart(2, "0");
                      const formattedDate = `${year}-${month}-${day}`;

                      setFormData((prev) => ({
                        ...prev,
                        end_date: formattedDate,
                      }));
                    }
                  }}
                />
                {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date}</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
            {/* Course Enrolled */}
            <div className="space-y-2">
              <Label>Course Enrolled</Label>
              <div className="relative">
                <CustomDropdown
                  options={courses.map(course => course.course_name)} // dynamically mapped
                  selected={formData.course_enrolled} // selected value
                  onSelect={(value) =>
                    setFormData({ ...formData, course_enrolled: value })
                  }
                />
                {errors.course_enrolled && (
                  <p className="text-red-500 text-sm">{errors.course_enrolled}</p>
                )}
              </div>
            </div>


            {/* Batch */}
            <div className="space-y-6">
              <div>
                <Label>Batch</Label>
                <div className="relative">
                  <Input placeholder="e.g. 2022-2023" type="text" className=""
                    value={formData.batch}
                    onChange={(e) => {
                      const inputValue = e.target.value.toUpperCase();
                      if (/^[A-Z]*$/.test(inputValue)) {
                        setFormData({ ...formData, batch: inputValue });
                      }
                    }} />
                  {errors.batch && <p className="text-red-500 text-sm">{errors.batch}</p>}
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
                  {errors.tutor && <p className="text-red-500 text-sm">{errors.tutor}</p>}
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
              {errors.pan_card && <p className="text-red-500 text-sm">{errors.pan_card}</p>}
            </div>
            <div className="space-y-6">
              <Label>Aadhar Card</Label>
              <FileUploadBox
                defaultFile={formData.aadhar_card_url}
                onFileChange={(file) =>
                  setFormData((prev) => ({ ...prev, aadhar_card: file }))
                }
              />
              {errors.aadhar_card && <p className="text-red-500 text-sm">{errors.aadhar_card}</p>}
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
              {errors.sslc_marksheet && <p className="text-red-500 text-sm">{errors.sslc_marksheet}</p>}
            </div>
            <div className="space-y-6">
              <Label>Passport Size Photo</Label>
              <FileUploadBox
                defaultFile={formData.passport_photo_url}
                onFileChange={(file) =>
                  setFormData((prev) => ({ ...prev, passport_photo: file }))
                }
              />
              {errors.passport_photo && <p className="text-red-500 text-sm">{errors.passport_photo}</p>}
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


