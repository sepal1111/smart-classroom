// File: /src/stores/classStore.js
// 說明：這是管理班級核心資料的 Pinia Store，現在將串接後端服務。

import { defineStore } from 'pinia';
import * as firestoreService from '../services/firestoreService';
import * as googleDriveService from '../services/googleDriveService';

export const useClassStore = defineStore('class', {
  state: () => ({
    students: [],
    seatingChart: new Map(),
    assessments: [], // 用來存放評量項目
    assignments: [], // 用來存放作業項目
    grades: new Map(), // 用來存放單一評量的成績
    attendance: new Map(),
    // --- 即時互動 state ---
    liveInteractionSession: null, // 存放當前即時互動的所有資料
    unsubscribeListener: null, // 存放停止監聽的函式
    // ----------------------
    isLoading: false,
    error: null,
  }),

  actions: {
    // --- 學生管理 Actions ---
    async fetchStudents() {
      this.isLoading = true;
      this.error = null;
      try {
        this.students = await firestoreService.getStudents();
      } catch (err) {
        this.error = '讀取學生資料時發生錯誤';
        console.error(this.error, err);
      } finally {
        this.isLoading = false;
      }
    },

    async addStudent(studentData) {
      this.isLoading = true;
      this.error = null;
      try {
        await firestoreService.addStudent(studentData);
        await this.fetchStudents(); // 新增後重新讀取列表
      } catch (err) {
        this.error = '新增學生時發生錯誤';
        console.error(this.error, err);
      } finally {
        this.isLoading = false;
      }
    },

    async updateStudent(studentId, studentData) {
       this.isLoading = true;
       this.error = null;
       try {
         await firestoreService.updateStudent(studentId, studentData);
         await this.fetchStudents(); // 更新後重新讀取列表
       } catch (err) {
         this.error = '更新學生資料時發生錯誤';
         console.error(this.error, err);
       } finally {
         this.isLoading = false;
       }
    },

    async deleteStudent(studentId) {
        this.isLoading = true;
        this.error = null;
        try {
            await firestoreService.deleteStudent(studentId);
            await this.fetchStudents(); // 刪除後重新讀取列表
        } catch (err) {
            this.error = '刪除學生時發生錯誤';
            console.error(this.error, err);
        } finally {
            this.isLoading = false;
        }
    },

    // --- 座位表 Actions ---
    async fetchSeatingChart() {
        this.isLoading = true;
        this.error = null;
        try {
            const layoutArray = await firestoreService.getSeatingLayout();
            if (layoutArray) {
                this.seatingChart = new Map(layoutArray);
            } else {
                this.seatingChart = new Map(); // 如果沒有儲存過，就用空的 Map
            }
        } catch (err) {
            this.error = '讀取座位表時發生錯誤';
            console.error(this.error, err);
        } finally {
            this.isLoading = false;
        }
    },

    async saveSeatingChart(layoutMap) {
      this.isLoading = true;
      this.error = null;
      try {
        const layoutArray = Array.from(layoutMap.entries());
        await firestoreService.saveSeatingLayout(layoutArray);
        this.seatingChart = layoutMap;
      } catch (err) {
        this.error = '儲存座位表時發生錯誤';
        console.error(this.error, err);
      } finally {
        this.isLoading = false;
      }
    },
    
    // --- 出缺席紀錄 Actions ---
    async fetchAttendanceForDate(date) {
      this.isLoading = true;
      this.error = null;
      try {
        const recordsArray = await firestoreService.getAttendanceRecord(date);
        if (recordsArray) {
          this.attendance = new Map(recordsArray);
          return recordsArray;
        } else {
          this.attendance = new Map();
          return [];
        }
      } catch (err) {
        this.error = `讀取 ${date} 的出缺席紀錄時發生錯誤`;
        console.error(this.error, err);
        return [];
      } finally {
        this.isLoading = false;
      }
    },

    async saveAttendanceForDate(date, recordsMap) {
      this.isLoading = true;
      this.error = null;
      try {
        const recordsArray = Array.from(recordsMap.entries());
        await firestoreService.saveAttendanceRecord(date, recordsArray);
        this.attendance = recordsMap;
      } catch (err) {
        this.error = `儲存 ${date} 的出缺席紀錄時發生錯誤`;
        console.error(this.error, err);
      } finally {
        this.isLoading = false;
      }
    },
    
    // --- 成績紀錄 Actions ---
    async fetchAssessments() {
      this.isLoading = true;
      this.error = null;
      try {
        this.assessments = await firestoreService.getAssessments();
        return this.assessments;
      } catch (err) {
        this.error = '讀取評量項目時發生錯誤';
        console.error(this.error, err);
        return [];
      } finally {
        this.isLoading = false;
      }
    },
    async addAssessment(assessmentName){
      this.isLoading = true;
      this.error = null;
      try {
        await firestoreService.addAssessment(assessmentName);
        await this.fetchAssessments();
      } catch (err) {
        this.error = '新增評量項目時發生錯誤';
        console.error(this.error, err);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchGradesForAssessment(assessmentId) {
      this.isLoading = true;
      this.error = null;
      try {
        const gradesArray = await firestoreService.getGradesRecord(assessmentId);
        if(gradesArray) {
            this.grades = new Map(gradesArray);
            return this.grades;
        } else {
            this.grades = new Map();
            return this.grades;
        }
      } catch (err) {
        this.error = `讀取評量 ${assessmentId} 的成績時發生錯誤`;
        console.error(this.error, err);
        return new Map();
      } finally {
        this.isLoading = false;
      }
    },

    async saveGradesForAssessment(assessmentId, gradesMap) {
      this.isLoading = true;
      this.error = null;
      try {
        const gradesArray = Array.from(gradesMap.entries());
        await firestoreService.saveGradesRecord(assessmentId, gradesArray);
        this.grades = gradesMap;
      } catch (err) {
        this.error = `儲存評量 ${assessmentId} 的成績時發生錯誤`;
        console.error(this.error, err);
      } finally {
        this.isLoading = false;
      }
    },

    // --- 數位作品繳交 Actions ---
    async fetchAssignments() {
       this.isLoading = true;
       this.error = null;
       try {
           this.assignments = await firestoreService.getAssignments();
       } catch (err) {
           this.error = '讀取繳交項目時發生錯誤';
           console.error(this.error, err);
       } finally {
           this.isLoading = false;
       }
    },

    async addAssignment(assignmentData) {
       this.isLoading = true;
       this.error = null;
       try {
           await firestoreService.addAssignment(assignmentData);
           await this.fetchAssignments(); // 新增後重新讀取
       } catch (err) {
           this.error = '新增繳交項目時發生錯誤';
           console.error(this.error, err);
       } finally {
           this.isLoading = false;
       }
    },

    async fetchSubmissionsForAssignment(assignmentId) {
        this.isLoading = true;
        this.error = null;
        try {
            const submissions = await firestoreService.getSubmissions(assignmentId);
            return submissions.map(sub => [sub.studentId, sub]);
        } catch (err) {
            this.error = `讀取作業 ${assignmentId} 的繳交紀錄時發生錯誤`;
            console.error(this.error, err);
            return [];
        } finally {
            this.isLoading = false;
        }
    },

    async submitAssignmentFile(assignment, student, file) {
      this.isLoading = true;
      this.error = null;
      try {
        const driveFileInfo = await googleDriveService.uploadFile(
          file,
          assignment.name,
          student.name
        );
        const submissionData = {
          studentName: student.name,
          fileName: driveFileInfo.name,
          driveFileId: driveFileInfo.id,
          webViewLink: driveFileInfo.webViewLink,
          iconLink: driveFileInfo.iconLink,
        };
        await firestoreService.setSubmission(assignment.id, student.id, submissionData);
        return submissionData;
      } catch (err) {
        this.error = `繳交作業時發生錯誤: ${err.message}`;
        console.error(this.error, err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    // --- 即時互動 Actions ---
    async startInteraction(questionData) {
      this.isLoading = true;
      this.error = null;
      try {
        await firestoreService.startInteractionSession(questionData);
      } catch (err) {
        this.error = '開始互動時發生錯誤';
        console.error(this.error, err);
      } finally {
        this.isLoading = false;
      }
    },

    async endInteraction() {
        this.isLoading = true;
        this.error = null;
        try {
            await firestoreService.endInteractionSession();
        } catch (err) {
            this.error = '結束互動時發生錯誤';
            console.error(this.error, err);
        } finally {
            this.isLoading = false;
        }
    },

    subscribeToInteraction() {
        if (this.unsubscribeListener) {
            this.unsubscribeListener();
        }
        this.unsubscribeListener = firestoreService.listenToInteractionSession((sessionData) => {
            this.liveInteractionSession = sessionData;
        });
    },

    unsubscribeFromInteraction() {
        if (this.unsubscribeListener) {
            this.unsubscribeListener();
            this.unsubscribeListener = null;
        }
        this.liveInteractionSession = null;
    },
  },
});
