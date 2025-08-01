import React from 'react';
import './ProfileHeader.css';
import KousyouIcon from '../icon/kousyou_color.png';

function ProfileHeader() {
  // ダミー値
  const posts = 35;
  const followers = 122;
  const following = 77;

  return (
    <div className="profile-header-insta">
      <div className="profile-header-row">
<img
  src={KousyouIcon}
  alt="icon"
  className="profile-icon-insta"
/>
        <div className="profile-counts-insta">
          <div>
            <span className="count-main-insta">{posts}</span>
            <span className="count-label-insta">投稿</span>
          </div>
          <div>
            <span className="count-main-insta">{followers}</span>
            <span className="count-label-insta">フォロワー</span>
          </div>
          <div>
            <span className="count-main-insta">{following}</span>
            <span className="count-label-insta">フォロー中</span>
          </div>
        </div>
      </div>
      <div className="profile-info-insta">
        <div className="profile-name-insta">2002年度蔵中同窓会</div>
        <div className="profile-desc-insta">令和7年8月10日 パレスグランデール</div>
      </div>
    </div>
  );
}

export default ProfileHeader;
