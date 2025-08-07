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
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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
  // アップロード進行表示用のstate追加
const [uploading, setUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
// 一括ダウンロード進捗用のstateを追加
const [downloading, setDownloading] = useState(false);
const [downloadProgress, setDownloadProgress] = useState(0);
const [downloadMsg, setDownloadMsg] = useState('');

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
  setUploading(true);
  setUploadProgress(0);
  let successCount = 0;
  for (let i = 0; i < files.length; i++) {
    await uploadPhoto({ file: files[i], name });
    setUploadProgress(Math.round(((i + 1) / files.length) * 100));
    successCount++;
  }
  setUploading(false);
  setUploadProgress(0);
  setToastMsg(`${name}さんの画像アップロードが完了しました！（${successCount}枚）`);
};


  // その他の関数
  const handlePhotoClick = (photo) => setSelectedPhoto(photo);
  const handleCloseLightbox = () => setSelectedPhoto(null);

const handleDownloadAll = async () => {
  if (!photos.length) {
    setDownloadMsg('画像がありません');
    setTimeout(() => setDownloadMsg(''), 3000);
    return;
  }
  setDownloading(true);
  setDownloadProgress(0);
  setDownloadMsg('ダウンロード準備中...');

  const zip = new JSZip();
  let count = 0;
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    try {
      const res = await fetch(photo.url);
      const blob = await res.blob();
      const ext = photo.url.split('.').pop().split('?')[0];
      const name = (photo.name || 'image') + `_${count + 1}.${ext}`;
      zip.file(name, blob);
      count++;
      setDownloadProgress(Math.round(((i + 1) / photos.length) * 100));
    } catch (e) {
      // 失敗してもスキップ
      continue;
    }
  }
  if (count === 0) {
    setDownloadMsg('画像の取得に失敗しました');
    setDownloading(false);
    setTimeout(() => setDownloadMsg(''), 3000);
    return;
  }
  setDownloadMsg('zip生成中...');
  zip.generateAsync({ type: 'blob' }).then(content => {
    saveAs(content, 'sharealbum.zip');
    setDownloadMsg('ダウンロード完了！');
    setDownloading(false);
    setDownloadProgress(0);
    setTimeout(() => setDownloadMsg(''), 4000);
  }).catch(() => {
    setDownloadMsg('zip生成に失敗しました');
    setDownloading(false);
    setTimeout(() => setDownloadMsg(''), 4000);
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
{uploading && (
  <div style={{
    position: 'fixed',
    top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(0,0,0,0.18)',
    zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  }}>
    <div style={{
      background: '#fff',
      borderRadius: 18,
      padding: '38px 28px 32px 28px',
      boxShadow: '0 6px 32px #0002',
      minWidth: 250,
      width: '84vw',
      maxWidth: 360,
      textAlign: 'center'
    }}>
      <div style={{
        fontWeight: 'bold', fontSize: '1.15em', marginBottom: 22, letterSpacing: '0.03em'
      }}>
        写真をアップロード中…
      </div>
      <div style={{
        background: '#e3e9f3',
        borderRadius: 12,
        overflow: 'hidden',
        height: 22,
        marginBottom: 10,
        boxShadow: '0 1px 4px #b5b5b522 inset'
      }}>
        <div style={{
          width: `${uploadProgress}%`,
          background: 'linear-gradient(90deg, #45aaf2, #36d1c4)',
          height: '100%',
          transition: 'width 0.3s'
        }} />
      </div>
      <div style={{
        fontSize: '1.04em',
        color: '#36a1da',
        marginTop: 4,
        fontWeight: 600,
        letterSpacing: '0.04em'
      }}>
        {uploadProgress}% 完了
      </div>
    </div>
  </div>
)}


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
  <div>
    <AdminPanel
      photos={photos}
      onDeleteAll={handleDeleteAll}
      onDownloadAll={handleDownloadAll}
      onDeleteOne={handleDeleteOne}
      userCount={userCount}
    />
    {downloading && (
      <div style={{ margin: '12px 0' }}>
        <div style={{
          background: '#eee',
          borderRadius: 8,
          overflow: 'hidden',
          height: 18,
          width: '100%'
        }}>
          <div style={{
            width: `${downloadProgress}%`,
            background: '#43a047',
            height: '100%',
            transition: 'width 0.3s'
          }} />
        </div>
        <div style={{ marginTop: 4, fontSize: '0.97em', color: '#43a047' }}>
          ダウンロード中... {downloadProgress}%
        </div>
      </div>
    )}
    {downloadMsg && (
      <div style={{ marginTop: 8, color: '#43a047', fontWeight: 'bold' }}>
        {downloadMsg}
      </div>
    )}
  </div>
} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
