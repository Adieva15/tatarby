import { ChangeEvent, useEffect, useState } from "react";
import api from "../api/api";
import Navigation from "../components/Navigation";
import { Loader } from "../components/Loader";
import "../styles/upload.css";
import "../styles/learn.css";

const MOCKUP: boolean = false;

const CACHED_TEXT = `Родной <t>тел</t> очень <t>матур</t>. Это язык моих родителей. Я узнал много интересного. Бабушка напевала в колыбели. Сестра рассказывала сказки ночью. Этот язык всегда помогает. Он делит мою <t>шатлык</t>. Он понимает мою печаль. Я помню первую молитву. Я прошу беречь родителей.`;

export const UploadPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState("");
  const [tooltip, setTooltip] = useState<{
    word: string;
    translation: string;
  } | null>(null);

  const [pending, setPending] = useState<boolean>(false);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const file = e.clipboardData?.files?.[0];
      if (!/image/.test(file?.type || "")) {
        throw new Error("File is not an image");
      }
      uploadFile(file);
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    await uploadFile(e.target.files?.[0]);
  };

  const uploadFile = async (file?: File | null) => {
    if (!file) {
      throw new Error("No files selected");
    }

    setText("");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    let result = "";

    if (MOCKUP) {
      result = await new Promise<string>((res) => {
        setTimeout(() => {
          res(CACHED_TEXT);
        }, 100);
      });
    } else {
      const res = await api.post<{ text: string }>(
        "/api/translate-and-adapt-text",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res.status < 200 || res.status >= 300) {
        throw new Error("Error returned from API");
      }

      result = res.data?.text ?? "";
    }

    setLoading(false);

    if (!result) {
      throw new Error("Returned text is EMPTY from API");
    }

    setText(result);
  };

  const renderText = (raw: string) => {
    const words = raw.split(/(\s+|[.,!?])/);

    return words.map((w, i) => {
      let clean = w.toLowerCase().replace(/[.,!?]/g, "");
      if (!clean) return <span key={i}>{w}</span>;

      if (!clean.startsWith("<t>") || !clean.endsWith("</t>")) {
        return (
          <span key={i} className="upload-word">
            {w}
          </span>
        );
      }

      clean = clean.replace(/<\/?t>/g, "");

      return (
        <span
          key={i}
          className="upload-word new"
          onClick={() => onClick(clean)}
        >
          {clean}
        </span>
      );
    });
  };

  const onClick = async (word: string) => {
    if (!word || pending) return;
    setPending(true);
    const res = await api.post("/api/word", { word });
    const data = res?.data as {
      word: string;
      translation: string;
      morph: object;
    };
    setTooltip({
      word,
      translation: data.word,
    });
    setPending(false);
  };

  // Состояние: загрузка
  if (loading) {
    return (
      <div className="upload-page">
        <Navigation />
        <div className="upload-container">
          <div className="upload-loading">
            <Loader />
            <p className="upload-loading-text">
              Обрабатываем фото... Татарин старается
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Состояние: есть текст
  if (text) {
    return (
      <div className="upload-page">
        <Navigation />

        <div className="upload-container">
          <div className="upload-text-header">
            <span className="upload-text-badge">Импорт</span>
            <span className="upload-text-title">Адаптированный текст</span>
          </div>

          <div className="upload-text-body">{renderText(text)}</div>

          <div className="upload-controls">
            <button className="learn-btn-secondary" onClick={() => setText("")}>
              Загрузить ещё
            </button>
          </div>

          {pending ? (
            <div
              className="upload-tooltip-overlay"
              onClick={() => setPending(false)}
            >
              <div
                className="upload-tooltip"
                onClick={(e) => e.stopPropagation()}
              >
                <Loader />

                <button
                  className="upload-tooltip-close"
                  onClick={() => setPending(false)}
                >
                  ×
                </button>
              </div>
            </div>
          ) : (
            tooltip && (
              <div
                className="upload-tooltip-overlay"
                onClick={() => setTooltip(null)}
              >
                <div
                  className="upload-tooltip"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="upload-tooltip-word">{tooltip.word}</div>
                  <div className="upload-tooltip-translation">
                    {tooltip.translation}
                  </div>
                  <button
                    className="upload-tooltip-close"
                    onClick={() => setTooltip(null)}
                  >
                    ×
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  // Состояние: начальное
  return (
    <div className="upload-page">
      <Navigation />

      <div className="upload-container">
        <h1 className="upload-title">Загрузить текст</h1>
        <p className="upload-subtitle">
          Сфотографируй страницу книги или загрузи изображение — мы распознаем
          текст и адаптируем его для твоего уровня.
        </p>

        <label className="upload-dropzone">
          <span className="upload-dropzone-icon">📷</span>
          <span className="upload-dropzone-text">
            Нажми, чтобы выбрать фото
          </span>
          <span className="upload-dropzone-hint">
            JPG, PNG, HEIC — до 10 МБ
          </span>
          <input
            type="file"
            className="upload-input-hidden"
            multiple={false}
            accept="image/*"
            onChange={onChange}
          />
        </label>
      </div>
    </div>
  );
};
