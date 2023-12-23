// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use deno_core::{serde_v8, v8, FastString, JsRuntime, RuntimeOptions};
use serde_json::json;
use std::rc::Rc;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn evaluate_script(script: String) -> serde_json::Value {
    let mut runtime = JsRuntime::new(RuntimeOptions::default());
    match runtime.execute_script("<anon>", FastString::Owned(script.into())) {
        Ok(global) => {
            let scope = &mut runtime.handle_scope();
            let local = v8::Local::new(scope, global);
            // Deserialize a `v8` object into a Rust type using `serde_v8`,
            // in this case deserialize to a JSON `Value`.
            let deserialized_value = serde_v8::from_v8::<serde_json::Value>(scope, local);

            match deserialized_value {
                Ok(value) => json! ({
                    "status": "success",
                    "result": value,
                }),
                Err(err) => json! ({
                    "status": "error",
                    "result": format!("{err:?}"),
                }),
            }
        }
        Err(err) => json! ({
            "status": "error",
            "result": format!("{err:?}"),
        }),
    }
}

// #[tauri::command]
// async fn evaluate_module(module: String) -> serde_json::Value {
//     let mut runtime = deno_core::JsRuntime::new(deno_core::RuntimeOptions {
//         module_loader: Some(Rc::new(deno_core::NoopModuleLoader)),
//         is_main: true,
//         ..Default::default()
//     });

//     let main_module = deno_core::ModuleSpecifier::parse("main").unwrap();

//     match runtime
//         .load_main_module(&main_module, Some(FastString::Owned(module.into())))
//         .await
//     {
//         Ok(mod_id) => {
//             let result = runtime.mod_evaluate(mod_id);
//             match runtime.run_event_loop(false).await {
//                 Ok(_) => {
//                     let _ = result.await;
//                     json! ({
//                         "status": "success",
//                         "result": "todo",
//                     })
//                 }
//                 Err(err) => json! ({
//                     "status": "error",
//                     "result": format!("Cannot deserialize value: {err:?}"),
//                 }),
//             }
//         }
//         Err(err) => json! ({
//             "status": "error",
//             "result": format!("Cannot instantiate runtime: {err:?}"),
//         }),
//     }
// }

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![evaluate_script])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
