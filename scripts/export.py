from ultralytics import YOLO
model = YOLO("../model/best_classification.pt")                 # 学習済みモデル
model.export(
    format="tflite",
    int8=True,                          # INT8 量子化を有効化
    data="",                            # データセット保存先パス
    fraction=0.25,                      # validation の 25% だけを使用（既定 1.0）
    imgsz=640                           # 入力サイズ
)
