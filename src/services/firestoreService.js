// File: /src/services/firestoreService.js
// 說明：這個檔案專門處理所有與 Firestore 資料庫的直接溝通。

import { db } from './firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

// 輔助函式：取得目前使用者的 ID
import { getAuth } from 'firebase/auth';
const getCurrentUserId = () => {
  const auth = getAuth();
  return auth.currentUser ? auth.currentUser.uid : null;
};

// --- 學生相關操作 (Students) ---
// ... (此處省略已完成的學生、座位表、出缺席、成績、作業相關程式碼) ...
export const getStudents = async () => {
  const userId = getCurrentUserId();
  if (!userId) return [];
  const studentsCol = collection(db, `users/${userId}/students`);
  const studentSnapshot = await getDocs(studentsCol);
  const students = studentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  students.sort((a, b) => a.seatNumber - b.seatNumber);
  return students;
};
export const addStudent = async (studentData) => {
  const userId = getCurrentUserId();
  if (!userId) return null;
  const studentsCol = collection(db, `users/${userId}/students`);
  const docRef = await addDoc(studentsCol, studentData);
  return docRef.id;
};
export const updateStudent = async (studentId, studentData) => {
  const userId = getCurrentUserId();
  if (!userId) return;
  const studentDoc = doc(db, `users/${userId}/students`, studentId);
  await updateDoc(studentDoc, studentData);
};
export const deleteStudent = async (studentId) => {
  const userId = getCurrentUserId();
  if (!userId) return;
  const studentDoc = doc(db, `users/${userId}/students`, studentId);
  await deleteDoc(studentDoc);
};
export const saveSeatingLayout = async (layoutData) => {
    const userId = getCurrentUserId();
    if (!userId) return;
    const seatingChartDoc = doc(db, `users/${userId}/configs`, 'seatingChart');
    await setDoc(seatingChartDoc, { layout: layoutData });
};
export const getSeatingLayout = async () => {
    const userId = getCurrentUserId();
    if (!userId) return null;
    const seatingChartDoc = doc(db, `users/${userId}/configs`, 'seatingChart');
    const docSnap = await getDoc(seatingChartDoc);
    if (docSnap.exists()) { return docSnap.data().layout; } else { return null; }
};
export const saveAttendanceRecord = async (date, recordsData) => {
    const userId = getCurrentUserId();
    if (!userId) return;
    const attendanceDoc = doc(db, `users/${userId}/attendance`, date);
    await setDoc(attendanceDoc, { records: recordsData });
};
export const getAttendanceRecord = async (date) => {
    const userId = getCurrentUserId();
    if (!userId) return null;
    const attendanceDoc = doc(db, `users/${userId}/attendance`, date);
    const docSnap = await getDoc(attendanceDoc);
    if (docSnap.exists()) { return docSnap.data().records; } else { return null; }
};
export const addAssessment = async (assessmentName) => {
    const userId = getCurrentUserId();
    if (!userId) return null;
    const assessmentsCol = collection(db, `users/${userId}/assessments`);
    const docRef = await addDoc(assessmentsCol, { name: assessmentName, createdAt: new Date() });
    return docRef.id;
};
export const getAssessments = async () => {
    const userId = getCurrentUserId();
    if (!userId) return [];
    const assessmentsCol = collection(db, `users/${userId}/assessments`);
    const snapshot = await getDocs(assessmentsCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
export const saveGradesRecord = async (assessmentId, gradesData) => {
    const userId = getCurrentUserId();
    if (!userId) return;
    const gradeDoc = doc(db, `users/${userId}/grades`, assessmentId);
    await setDoc(gradeDoc, { grades: gradesData });
};
export const getGradesRecord = async (assessmentId) => {
    const userId = getCurrentUserId();
    if (!userId) return null;
    const gradeDoc = doc(db, `users/${userId}/grades`, assessmentId);
    const docSnap = await getDoc(gradeDoc);
    if (docSnap.exists()) { return docSnap.data().grades; } else { return null; }
};
export const addAssignment = async (assignmentData) => {
    const userId = getCurrentUserId();
    if (!userId) return null;
    const assignmentsCol = collection(db, `users/${userId}/assignments`);
    const docRef = await addDoc(assignmentsCol, { ...assignmentData, createdAt: new Date() });
    return docRef.id;
};
export const getAssignments = async () => {
    const userId = getCurrentUserId();
    if (!userId) return [];
    const assignmentsCol = collection(db, `users/${userId}/assignments`);
    const snapshot = await getDocs(assignmentsCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
export const getSubmissions = async (assignmentId) => {
    const userId = getCurrentUserId();
    if (!userId) return [];
    const submissionsCol = collection(db, `users/${userId}/assignments/${assignmentId}/submissions`);
    const snapshot = await getDocs(submissionsCol);
    return snapshot.docs.map(doc => ({ studentId: doc.id, ...doc.data() }));
};


// --- 課堂即時互動相關操作 (Real-time Interaction) ---

// 取得即時互動的文件引用
const getLiveInteractionDocRef = () => {
    const userId = getCurrentUserId();
    if (!userId) return null;
    // 使用一個固定的文件路徑來代表當前的即時互動
    return doc(db, `users/${userId}/interactions`, 'liveSession');
}

// 開始一個新的互動
export const startInteractionSession = async (questionData) => {
    const docRef = getLiveInteractionDocRef();
    if (!docRef) return;
    const sessionData = {
        ...questionData,
        isLive: true,
        answers: {}, // 用一個 map 來儲存學生的答案 { studentId: answerData }
        startedAt: new Date(),
    };
    await setDoc(docRef, sessionData);
};

// 結束目前的互動
export const endInteractionSession = async () => {
    const docRef = getLiveInteractionDocRef();
    if (!docRef) return;
    await updateDoc(docRef, { isLive: false });
};

// 監聽即時互動的變化
export const listenToInteractionSession = (callback) => {
    const docRef = getLiveInteractionDocRef();
    if (!docRef) return () => {}; // 回傳一個空的 unsubscribe 函式
    
    // onSnapshot 會建立一個即時監聽器
    // 當文件內容有任何變化時，它提供的回呼函式 (callback) 就會被觸發
    const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data());
        } else {
            callback(null); // 如果文件不存在，回傳 null
        }
    });
    
    // 回傳 unsubscribe 函式，讓呼叫者可以在需要時停止監聽
    return unsubscribe;
};

// (學生端用) 提交答案
export const submitAnswer = async (studentId, answerData) => {
    const docRef = getLiveInteractionDocRef();
    if (!docRef) return;
    // 使用點記法 (dot notation) 來更新 map 中的特定欄位
    // 這樣可以避免覆蓋掉其他學生的答案
    const fieldPath = `answers.${studentId}`;
    await updateDoc(docRef, {
        [fieldPath]: answerData
    });
};

