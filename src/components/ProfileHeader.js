import React from 'react';
import './ProfileHeader.css';
import KousyouIcon from '../icon/kousyou_color.png';

function ProfileHeader(props) {
  const posts = 35;
  const followers = 122;
  const following = 77;

  return (
    <>
      {/* 上段：ストーリーグラデーションリング付きアイコン＋カウント群 */}
      <div
        className="profile-header-insta"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '20px 10px 12px 10px',
          maxWidth: 400,
          margin: '0 auto'
        }}
      >
        {/* アイコン（左） */}
        <div className="story-gradient-ring" style={{ marginRight: 22 }}>
          <img
            src={KousyouIcon}
            alt="icon"
            className="profile-icon-insta"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              objectFit: "cover",
              background: "#fff",
              border: "none"
            }}
            onClick={props.onSlideShowClick}
          />
        </div>
        {/* カウント群（右） */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between'
          }}
        >
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div className="count-main-insta" style={{ fontWeight: 'bold', fontSize: 16 }}>{posts}</div>
            <div className="count-label-insta" style={{ fontSize: 11, color: '#444' }}>投稿</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div className="count-main-insta" style={{ fontWeight: 'bold', fontSize: 16 }}>{followers}</div>
            <div className="count-label-insta" style={{ fontSize: 11, color: '#444' }}>フォロワー</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div className="count-main-insta" style={{ fontWeight: 'bold', fontSize: 16 }}>{following}</div>
            <div className="count-label-insta" style={{ fontSize: 11, color: '#444' }}>フォロー中</div>
          </div>
        </div>
      </div>
      {/* 下段：プロフィール名・説明文 */}
      <div style={{ maxWidth: 400, margin: '0 auto', paddingLeft: 12, paddingRight: 12 }}>
        <div className="profile-name-insta" style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 2 }}>2002年度蔵中同窓会</div>
        <div className="profile-desc-insta" style={{ color: '#444', fontSize: 14 }}>令和7年8月10日 パレスグランデール</div>
      </div>
    </>
  );
}

export default ProfileHeader;
