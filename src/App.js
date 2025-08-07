import React, { useRef, useState, useEffect } from 'react';
import Gallery from './components/Gallery';
import './App.css'; 
import Lightbox from './components/Lightbox';
import ProfileHeader from './components/ProfileHeader';
import PhotoUpload from './components/PhotoUpload';
import Toast from './components/Toast'; 
import BottomNavBar from './components/BottomNavBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import SlideShow from './components/SlideShow'; 
import { uploadPhoto } from './firebaseUtils'; 
import { db, storage } from './FireBaseConfig';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  getDoc,
  getDocs
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import KousyouIcon from './icon/kousyou_color.png';

const PROFILE_IMG = KousyouIcon;

const samplePhotos = [
  { id: 1, url: 'https://placehold.jp/150x150.png', name: 'たなか' },
  { id: 2, url: 'https://placehold.jp/150x150.png?text=2', name: 'さとう' },
  { id: 3, url: 'https://placehold.jp/150x150.png?text=3', name: 'すずき' },
  { id: 4, url: 'https://placehold.jp/150x150.png?text=4', name: 'さいとう' },
  { id: 5, url: 'https://placehold.jp/150x150.png?text=5', name: 'いとう' },
];

function App() {
  // 名前管理
  const [name, setName] = useState(localStorage.getItem('sharealbum_name') || '');
  const [showNameDialog, setShowNameDialog] = useState(!name);
  // 投稿画像
  const [photos, setPhotos] = useState([]);
  // その他UI
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [showSlide, setShowSlide] = useState(false);
  const photoUploadRef = useRef(null);

  // +ボタン押下時の処理
  const openFileDialog = () => {
    if (!name) {
      setShowNameDialog(true);
      return;
    }
    if (photoUploadRef.current) {
      photoUploadRef.current.click();
    }
  };

  // 名前再設定用
  const handleSaveName = (newName) => {
    setName(newName);
    localStorage.setItem('sharealbum_name', newName);
    setShowNameDialog(false);
  };

  // 画像アップロード（選択時に即実行・Firebaseへ保存）
const handleUpload = async ({ name, files }) => {
  for (const file of files) {
    await uploadPhoto({ file, name });
  }
  setToastMsg(`${name}さんの画像アップロードが完了しました！`);
};


  // その他の関数
  const handlePhotoClick = (photo) => setSelectedPhoto(photo);
  const handleCloseLightbox = () => setSelectedPhoto(null);
  const handleDownloadAll = () => {
  if (!photos.length) {
    alert('画像がありません');
    return;
  }
  photos.forEach((photo, i) => {
    const link = document.createElement('a');
    link.href = photo.url;
    // ファイル名生成
    const ext = photo.url.split('.').pop().split('?')[0];
    link.download = (photo.name || 'image') + `_${i + 1}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};


  // 画像1枚削除
  const handleDeleteOne = async (id) => {
    try {
      // Firestoreからドキュメント取得
      const photoDoc = await getDoc(doc(db, "photos", id));
      if (photoDoc.exists()) {
        const data = photoDoc.data();
        // storagePathフィールドが存在すればStorageからも削除
        if (data.storagePath) {
          const imageRef = ref(storage, data.storagePath);
          await deleteObject(imageRef);
        }
        // Firestoreからドキュメント削除
        await deleteDoc(doc(db, "photos", id));
      }
    } catch (err) {
      console.error("削除失敗", err);
    }
  };

  // 全画像削除
  const handleDeleteAll = async () => {
    try {
      const q = collection(db, "photos");
      const snap = await getDocs(q);
      for (const docSnap of snap.docs) {
        const data = docSnap.data();
        if (data.storagePath) {
          const imageRef = ref(storage, data.storagePath);
          await deleteObject(imageRef);
        }
        await deleteDoc(doc(db, "photos", docSnap.id));
      }
    } catch (err) {
      console.error("全削除失敗", err);
    }
  };

  const userCount = 3;

  const handleShowSlide = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    setShowSlide(true);
  };
useEffect(() => {
  const q = query(collection(db, "photos"), orderBy("createdAt", "desc"));
  let prevIds = [];
  const unsub = onSnapshot(q, snap => {
    const nextPhotos = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPhotos(nextPhotos);

    // 新規追加の検知
    const currentIds = nextPhotos.map(p => p.id);
    // prevIdsが空でない場合のみ新着チェック（最初の初期化で大量に出ないように）
    if (prevIds.length && currentIds.length > prevIds.length) {
      // 新たに追加された画像を検出
      const newItems = nextPhotos.filter(p => !prevIds.includes(p.id));
      if (newItems.length > 0) {
        // 例: 最初の1件だけトースト（複数追加時も最初のだけ）
        setToastMsg(`${newItems[0].name || '新しいユーザー'}さんが画像をアップロードしました！`);
      }
    }
    prevIds = currentIds;
  });
  return unsub;
}, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div style={{ maxWidth: 400, margin: '0 auto', paddingBottom: 68 }}>
            {/* 名前ダイアログ */}
            {showNameDialog && (
              <div className="modal-backdrop">
                <div className="name-dialog-modal">
                  <div style={{marginBottom:14, fontWeight:'bold', fontSize:'1.15em'}}>お名前を入力してください</div>
                  <input
                    type="text"
                    placeholder="名前を入力"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{fontSize:'1.1em', padding:8, width:'92%', marginBottom:10}}
                  />
                  <button
                    onClick={() => handleSaveName(name)}
                    disabled={!name.trim()}
                    style={{fontSize:'1em', padding:'7px 20px', borderRadius:8}}
                  >名前を保存</button>
                </div>
              </div>
            )}
            {/* 非表示inputだけ設置 */}
            <PhotoUpload
              ref={photoUploadRef}
              onUpload={handleUpload}
              name={name}
            />

            <ProfileHeader posts={photos.length} onSlideShowClick={handleShowSlide} />
            <Gallery photos={photos} onPhotoClick={handlePhotoClick} />
            <Lightbox photo={selectedPhoto} onClose={handleCloseLightbox} />
            <Toast message={toastMsg} onClose={() => setToastMsg('')} />
            <BottomNavBar
              onPlusClick={openFileDialog}
              profileImg={PROFILE_IMG}
              onProfileClick={() => setShowNameDialog(true)}
              onSlideShowClick={handleShowSlide}
            />
            {showSlide && (
              <SlideShow
                photos={photos}
                onClose={() => setShowSlide(false)}
              />
            )}
          </div>
        } />
        <Route path="/admin" element={
          <AdminPanel
            photos={photos}
            onDeleteAll={handleDeleteAll}
            onDownloadAll={handleDownloadAll}
            onDeleteOne={handleDeleteOne}
            userCount={userCount}
          />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
