use rdev::{display_size, listen};

/// 获取当前屏幕尺寸 [w, h]
pub fn get_screen_size() -> [u64; 2] {
    let (w, h) = display_size().unwrap();
    [w, h]
}

/// 录制按键流程
pub fn do_key_record() {
    if let Err(err_msg) = listen(|ev| {
        println!("ev: {:?}", ev);
        match ev.name {
            Some(ev_name) => println!("user press: {:?}", ev_name),
            None => ()
        }
    }) {
        println!("Error when setup listener: {:?}", err_msg);
    }
}