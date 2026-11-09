"use client"

import React, {useState} from "react"
import { useNavigate } from "react-router-dom"
import { ChevronUp, ChevronDown, Wifi, Home } from "react-feather"
import { LevelInfo, Master, StarData, ClassData } from '../types/common';
import Header from "../components/Header"
import NavBar from "../components/NavBar"
import MasterCard from "../components/MasterCard"


interface LocationState {
  masterInfo: Master;
  stars: StarData[];
  classes: ClassData[];
  totalScore: number;
  levelInfo: LevelInfo;
  progressValue: number;
}

const ClassPreview: React.FC = () => {
  const navigate = useNavigate()
  const storedState = localStorage.getItem('navigationState');

  if (!storedState) {
    navigate('/');
    return null;
  }

  const data = JSON.parse(storedState) as LocationState;

  if (!data.masterInfo || !data.masterInfo.id) {
    navigate('/');
    return null;
  }

  const { masterInfo, totalScore ,progressValue , levelInfo, classes } = data;



  const [expandedCourses, setExpandedCourses] = useState<string[]>([])

  const toggleCourse = (id: string) => {
    setExpandedCourses((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleBack = () => {
    navigate('/profile');
  }

  // Format date from mm/dd/yyyy to yyyy.mm.dd
  const formatDate = (dateString: string) => {
    const [month, day, year] = dateString.split("/")
    return `${year}.${month}.${day}`
  }

  if (classes.length === 0) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="my-3 bg-white rounded-2xl">
          <Header
            isIndex={false}
            onLeftClick={handleBack}
          />
        </div>
        <div className="text-center text-gray-500 mt-10">暫無課程</div>
        <NavBar />

      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className='bg-white rounded-b-2xl shadow'>
        <div className="shrink-0 mt-3">
          <Header
            isIndex={false}
            onLeftClick={handleBack}
          />
        </div>
        {/* Profile Content */}
        <div className="mx-4">
          <MasterCard
            masterInfo={masterInfo}
            totalScore={totalScore}
            progressValue={progressValue}
            levelInfo={levelInfo}
          />
        </div>
      </div>

      {/* Subtitle */}
      <div className="px-6 py-4">
        <h2 className="text-xl font-bold">課程表</h2>
      </div>

      {/* Course List */}
      <div className="mx-6 bg-white rounded-3xl shadow-md min-h-0 overflow-y-auto mb-16 px-4 pt-4">
        {classes.map((course) => {
          const isExpanded = expandedCourses.includes(course._id)
          const formattedDate = formatDate(course.date)
          const isOnline = course.type === "1" // Assuming 'online' is the key for online courses

          return (
            <div key={course._id} className="py-4 border-b border-gray-100 last:border-b-0" onClick={() => toggleCourse(course._id)}>
              <div className="flex items-start">
                {/* Date and Time */}
                <div className="w-1/3 pr-2">
                  <div className="text-base font-bold">{formattedDate}</div>
                  <div className="text-sm text-gray-500">
                    {course.startTime.substring(0, 5)} - {course.endTime.substring(0, 5)}
                  </div>
                </div>

                {/* Course Name */}
                <div className="w-1/3 flex-grow">
                  <div className="text-base font-medium">{course.name}</div>
                </div>

                {/* Course Type and Expand Button */}
                <div className="flex items-center space-x-2">
                  <div className={`rounded-full p-2 ${isOnline ? "bg-blue-100" : "bg-yellow-100"}`}>
                    {isOnline ? (
                      <Wifi size={18} className="text-blue-500" />
                    ) : (
                      <Home size={18} className="text-yellow-600" />
                    )}
                  </div>
                  <div className="text-sm">{isOnline ? "線上" : "實體"}</div>
                  <button className="ml-2">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="mt-2 ml-4 text-sm text-gray-600">
                  <p>備註: {course.remarks || "無"}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <NavBar />
    </div>
  )
}

export default ClassPreview