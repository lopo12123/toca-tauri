use tauri::command;

#[command]
pub fn maximum_window() {
    println!("最大化");
}

#[command]
pub fn minimum_window() {
    println!("最小化");
}

#[command]
pub fn exit_app() {
    println!("退出app");
}