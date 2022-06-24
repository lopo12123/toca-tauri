#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

mod app_banner;
mod toca;

use tauri::{Builder, command, generate_context, generate_handler};
use app_banner::*;

fn main() {
    let context = generate_context!();
    Builder::default()
        // ipc 命令
        .invoke_handler(generate_handler![maximum_window, minimum_window, exit_app])
        // 创建一个空的菜单列表则菜单自动隐藏
        .menu(tauri::Menu::with_items(vec![]))
        .run(context)
        .expect("error while running tauri application");
}

#[command]
fn greet(msg: &str) {
    println!("msg from front-end: {}", msg);
}