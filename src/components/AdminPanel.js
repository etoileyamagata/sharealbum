import React, { useState } from 'react';

function AdminPanel({ photos, onDeleteAll, onDownloadAll, onDeleteOne, userCount }) {
  const [input, setInput] = useState('');
  const [authed, setAuthed] = useState(false);

  // パスワード認証（7139）
  const handleLogin = () => {
    if (input === "7139") setAuthed(true);
    else alert("パスワードが違います");
  };

  if (!authed) {
    return (
      <div style={{maxWidth:350,margin:'40px auto',padding:28,background:'#fff',borderRadius:14,boxShadow:'0 4px 22px #0002',textAlign:'center'}}>
        <h3>管理者ログイン</h3>
        <input
          type="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="パスワード"
          style={{fontSize:'1.2em',padding:6,margin:'12px 0',width:'80%'}}
        />
        <button onClick={handleLogin} style={{fontSize:'1.1em',padding:'6px 22px',borderRadius:7}}>ログイン</button>
      </div>
    );
  }

  return (
    <div style={{maxWidth:400,margin:'40px auto',padding:26,background:'#fff',borderRadius:14,boxShadow:'0 4px 22px #0002'}}>
      <h3>管理者パネル</h3>
      <div style={{margin:'15px 0'}}>
        <button style={{marginRight:12}} onClick={()=>{
          if(window.confirm("本当に全写真を削除しますか？")) onDeleteAll();
        }}>全写真を一括削除</button>
        <button onClick={onDownloadAll}>全写真を一括ダウンロード</button>
      </div>
      <div style={{margin:'18px 0 0 0',fontSize:'.99em',fontWeight:'bold'}}>現在の写真一覧</div>
      <ul style={{listStyle:'none',padding:0,maxHeight:300,overflowY:'auto'}}>
        {photos.map((p,i)=>(
          <li key={p.id} style={{display:'flex',alignItems:'center',margin:'6px 0'}}>
            <img src={p.url} alt="" style={{width:44,height:44,borderRadius:8,marginRight:10}} />
            <span style={{flex:1}}>{p.name}</span>
            <button style={{padding:'2px 8px',borderRadius:5}} onClick={()=>onDeleteOne(p.id)}>削除</button>
          </li>
        ))}
      </ul>
      <div style={{marginTop:14, fontSize:'.98em'}}>
        写真枚数：{photos.length}枚<br />
        {typeof userCount !== 'undefined' && (
          <>現在アクセス中の人数：{userCount}人</>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
