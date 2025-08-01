import React from 'react';
import { ReactComponent as HomeIcon } from '../icon/home.svg';
import { ReactComponent as SearchIcon } from '../icon/search.svg';
import { ReactComponent as AddIcon } from '../icon/add.svg';
import { ReactComponent as PlayIcon } from '../icon/play.svg';
import './BottomNavBar.css';

function BottomNavBar({ onPlusClick, profileImg, onProfileClick, onSlideShowClick }) {
  return (
    <nav className="bottom-nav-insta">
      <button className="nav-btn"><HomeIcon width={29} height={29} /></button>
      <button className="nav-btn"><SearchIcon width={27} height={27} /></button>
      <button className="nav-btn nav-plus" onClick={onPlusClick}>
        <AddIcon width={38} height={38} />
      </button>
            <button className="nav-btn" onClick={onSlideShowClick}>
        <PlayIcon width={27} height={27} />
      </button>
  <button className="nav-btn nav-profile-btn" onClick={onProfileClick}>
        <img
          src={profileImg}
          alt="MyPage"
          width={28}
          height={28}
          style={{
            borderRadius: "50%",
            border: "2px solid #e95950",
            objectFit: "cover",
          }}
        />
      </button>
    </nav>
  );
}


export default BottomNavBar;
