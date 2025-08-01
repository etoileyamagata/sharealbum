import { storage, db } from './FireBaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// 写真1枚アップロード＋Firestoreへメタ追加
export async function uploadPhoto({ file, name }) {
  // 保存先パスは "photos/タイムスタンプ-ファイル名"
  const filePath = `photos/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, filePath);
  // Storageへ画像アップロード
  const snap = await uploadBytes(storageRef, file);
  // 公開URLを取得
  const url = await getDownloadURL(snap.ref);
  // Firestoreへメタデータを保存（storagePath追加）
  await addDoc(collection(db, "photos"), {
    url,
    storagePath: filePath,  // ←ここを追加
    name,
    createdAt: serverTimestamp(),
  });
}
