-- PostgreSQL Migration: Initial Schema
-- Converted from MySQL to PostgreSQL syntax

CREATE TABLE languages (
    id           SMALLSERIAL PRIMARY KEY, -- id ngôn ngữ
    code         VARCHAR(10) NOT NULL UNIQUE, -- mã ngôn ngữ: 'en', 'vi', 'zh', ...
    name         VARCHAR(100) NOT NULL, -- tên ngôn ngữ (English)
    native_name  VARCHAR(100) -- tên bản địa: 'Tiếng Việt', '中文'
);

CREATE TABLE parts_of_speech (
    id      SMALLSERIAL PRIMARY KEY, -- id từ loại
    code    VARCHAR(20) NOT NULL UNIQUE, -- mã từ loại: 'noun', 'verb', ...
    name    VARCHAR(100) NOT NULL -- tên từ loại
);

CREATE TABLE topics (
    id      BIGSERIAL PRIMARY KEY, -- id chủ đề
    code    VARCHAR(50) NOT NULL UNIQUE, -- mã chủ đề: 'education', 'travel', ...
    name    VARCHAR(100) NOT NULL -- tên chủ đề
);

CREATE TABLE levels (
    id                BIGSERIAL PRIMARY KEY, -- id level
    code              VARCHAR(50) NOT NULL UNIQUE, -- mã level: 'HSK1', 'A1', 'N3', ...
    name              VARCHAR(100) NOT NULL, -- tên level hiển thị
    description       TEXT, -- mô tả level
    language_id       SMALLINT, -- FK -> languages.id (null nếu level chung)
    difficulty_order  SMALLINT, -- thứ tự độ khó (1 < 2 < 3 ...)
    CONSTRAINT fk_levels_lang
        FOREIGN KEY (language_id) REFERENCES languages(id)
);

CREATE INDEX idx_levels_lang ON levels(language_id, difficulty_order);

CREATE TABLE words (
    id                   BIGSERIAL PRIMARY KEY, -- id từ
    language_id          SMALLINT NOT NULL, -- FK -> languages.id
    lemma                VARCHAR(255) NOT NULL, -- dạng từ gốc (headword)
    lemma_normalized     VARCHAR(255), -- dạng chuẩn hóa (bỏ dấu, lower-case)
    search_key           VARCHAR(255), -- key tìm kiếm (pinyin, không dấu, ...)
    part_of_speech_id    SMALLINT, -- FK -> parts_of_speech.id
    romanization         VARCHAR(255), -- phiên âm latin (pinyin, Hán-Việt, ...)
    script_code          VARCHAR(20), -- mã hệ chữ: 'Latn', 'Hani', ...
    frequency_rank       INTEGER, -- tần suất/xếp hạng độ phổ biến
    notes                TEXT, -- ghi chú
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- ngày tạo
    updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- ngày cập nhật
    CONSTRAINT fk_words_language
        FOREIGN KEY (language_id) REFERENCES languages(id),
    CONSTRAINT fk_words_pos
        FOREIGN KEY (part_of_speech_id) REFERENCES parts_of_speech(id)
);

CREATE INDEX idx_words_lang_lemma ON words(language_id, lemma);
CREATE INDEX idx_words_lang_norm ON words(language_id, lemma_normalized);
CREATE INDEX idx_words_lang_search ON words(language_id, search_key);

CREATE TABLE senses (
    id                     BIGSERIAL PRIMARY KEY, -- id nghĩa
    word_id                BIGINT NOT NULL, -- FK -> words.id
    sense_order            SMALLINT NOT NULL, -- thứ tự nghĩa của từ
    definition             TEXT NOT NULL, -- diễn giải nghĩa
    definition_language_id SMALLINT NOT NULL, -- FK -> languages.id (ngôn ngữ của diễn giải)
    usage_label            VARCHAR(100), -- nhãn sử dụng: 'figurative', 'slang', ...
    level_id               BIGINT, -- FK -> levels.id (cấp độ)
    note                   TEXT, -- ghi chú
    CONSTRAINT fk_senses_word
        FOREIGN KEY (word_id) REFERENCES words(id),
    CONSTRAINT fk_senses_def_lang
        FOREIGN KEY (definition_language_id) REFERENCES languages(id),
    CONSTRAINT fk_senses_level
        FOREIGN KEY (level_id) REFERENCES levels(id)
);

CREATE INDEX idx_senses_word_order ON senses(word_id, sense_order);

CREATE TABLE sense_translations (
    id                 BIGSERIAL PRIMARY KEY, -- id bản dịch nghĩa
    source_sense_id    BIGINT NOT NULL, -- FK -> senses.id (nghĩa nguồn)
    target_word_id     BIGINT NOT NULL, -- FK -> words.id (từ đích)
    target_language_id SMALLINT NOT NULL, -- FK -> languages.id (ngôn ngữ đích)
    priority           SMALLINT DEFAULT 1, -- độ ưu tiên hiển thị (1 = cao nhất)
    note               TEXT, -- ghi chú
    CONSTRAINT fk_st_source_sense
        FOREIGN KEY (source_sense_id) REFERENCES senses(id),
    CONSTRAINT fk_st_target_word
        FOREIGN KEY (target_word_id) REFERENCES words(id),
    CONSTRAINT fk_st_target_lang
        FOREIGN KEY (target_language_id) REFERENCES languages(id)
);

CREATE INDEX idx_st_source ON sense_translations(source_sense_id);
CREATE INDEX idx_st_target ON sense_translations(target_language_id, target_word_id);

CREATE TABLE word_relations (
    id            BIGSERIAL PRIMARY KEY, -- id quan hệ từ
    from_word_id  BIGINT NOT NULL, -- FK -> words.id (từ nguồn)
    to_word_id    BIGINT NOT NULL, -- FK -> words.id (từ đích)
    relation_type VARCHAR(20) NOT NULL, -- loại quan hệ: 'synonym', 'antonym', 'related'
    note          TEXT, -- ghi chú
    CONSTRAINT fk_wr_from
        FOREIGN KEY (from_word_id) REFERENCES words(id),
    CONSTRAINT fk_wr_to
        FOREIGN KEY (to_word_id) REFERENCES words(id)
);

CREATE INDEX idx_wr_from ON word_relations(from_word_id, relation_type);
CREATE INDEX idx_wr_to ON word_relations(to_word_id, relation_type);

CREATE TABLE word_topics (
    word_id  BIGINT NOT NULL, -- FK -> words.id
    topic_id BIGINT NOT NULL, -- FK -> topics.id
    PRIMARY KEY (word_id, topic_id),
    CONSTRAINT fk_wt_word
        FOREIGN KEY (word_id) REFERENCES words(id),
    CONSTRAINT fk_wt_topic
        FOREIGN KEY (topic_id) REFERENCES topics(id)
);

CREATE TABLE examples (
    id              BIGSERIAL PRIMARY KEY, -- id câu ví dụ
    source_sense_id BIGINT NOT NULL, -- FK -> senses.id (nghĩa được minh họa)
    language_id     SMALLINT NOT NULL, -- FK -> languages.id (ngôn ngữ của câu)
    content         TEXT NOT NULL, -- nội dung câu ví dụ
    audio_url       VARCHAR(500), -- link audio của câu (nếu có)
    source          VARCHAR(255), -- nguồn câu (sách, phim, ...)
    CONSTRAINT fk_examples_sense
        FOREIGN KEY (source_sense_id) REFERENCES senses(id),
    CONSTRAINT fk_examples_lang
        FOREIGN KEY (language_id) REFERENCES languages(id)
);

CREATE INDEX idx_examples_sense ON examples(source_sense_id);
CREATE INDEX idx_examples_lang ON examples(language_id);

CREATE TABLE example_translations (
    id          BIGSERIAL PRIMARY KEY, -- id bản dịch câu ví dụ
    example_id  BIGINT NOT NULL, -- FK -> examples.id (câu gốc)
    language_id SMALLINT NOT NULL, -- FK -> languages.id (ngôn ngữ bản dịch)
    content     TEXT NOT NULL, -- nội dung bản dịch
    CONSTRAINT fk_ext_example
        FOREIGN KEY (example_id) REFERENCES examples(id),
    CONSTRAINT fk_ext_lang
        FOREIGN KEY (language_id) REFERENCES languages(id)
);

CREATE INDEX idx_ext_example ON example_translations(example_id);

CREATE TABLE pronunciations (
    id        BIGSERIAL PRIMARY KEY, -- id phát âm
    word_id   BIGINT NOT NULL, -- FK -> words.id (từ tương ứng)
    dialect   VARCHAR(20), -- phương ngữ: 'en-US', 'en-UK', 'vi-North', ...
    ipa       VARCHAR(255), -- phiên âm IPA: /skuːl/
    phonetic  VARCHAR(255), -- phiên âm dễ đọc: 's-kuul'
    audio_url VARCHAR(500), -- link audio phát âm
    CONSTRAINT fk_pron_word
        FOREIGN KEY (word_id) REFERENCES words(id)
);

CREATE INDEX idx_pron_word ON pronunciations(word_id);

CREATE TABLE characters (
    id          BIGSERIAL PRIMARY KEY, -- id ký tự
    literal     VARCHAR(2) NOT NULL, -- ký tự: '学'
    simplified  VARCHAR(2), -- dạng giản thể
    traditional VARCHAR(2), -- dạng phồn thể
    script_code VARCHAR(10) NOT NULL, -- mã hệ chữ: 'Hani' (Chinese), ...
    strokes     SMALLINT, -- số nét
    radical     VARCHAR(10), -- bộ thủ
    level       VARCHAR(20) -- cấp độ: 'HSK1', 'HSK2', ...
);

CREATE TABLE character_readings (
    id           BIGSERIAL PRIMARY KEY, -- id cách đọc ký tự
    character_id BIGINT NOT NULL, -- FK -> characters.id
    language_id  SMALLINT NOT NULL, -- FK -> languages.id
    reading      VARCHAR(100) NOT NULL, -- cách đọc: pinyin, Hán-Việt, ...
    reading_type VARCHAR(50), -- loại đọc: 'pinyin', 'sino-vietnamese', ...
    note         TEXT, -- ghi chú
    CONSTRAINT fk_cr_char
        FOREIGN KEY (character_id) REFERENCES characters(id),
    CONSTRAINT fk_cr_lang
        FOREIGN KEY (language_id) REFERENCES languages(id)
);

CREATE INDEX idx_cr_char ON character_readings(character_id);
CREATE INDEX idx_cr_lang ON character_readings(language_id);

CREATE TABLE word_characters (
    word_id      BIGINT NOT NULL, -- FK -> words.id (thường là từ tiếng Trung)
    character_id BIGINT NOT NULL, -- FK -> characters.id
    char_order   SMALLINT NOT NULL, -- vị trí ký tự trong từ: 1,2,3,...
    PRIMARY KEY (word_id, char_order),
    CONSTRAINT fk_wc_word
        FOREIGN KEY (word_id) REFERENCES words(id),
    CONSTRAINT fk_wc_char
        FOREIGN KEY (character_id) REFERENCES characters(id)
);

CREATE TABLE users (
    id             BIGSERIAL PRIMARY KEY, -- id người dùng
    email          VARCHAR(255) UNIQUE, -- email đăng nhập (có thể null nếu login kiểu khác)
    username       VARCHAR(100) UNIQUE, -- tên đăng nhập
    password_hash  VARCHAR(255), -- mật khẩu đã hash
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- thời gian tạo tài khoản
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- thời gian cập nhật
    is_active      BOOLEAN DEFAULT TRUE -- trạng thái kích hoạt
);

CREATE TABLE user_profiles (
    user_id       BIGINT PRIMARY KEY, -- FK -> users.id
    display_name  VARCHAR(100), -- tên hiển thị
    avatar_url    VARCHAR(500), -- link ảnh đại diện
    birth_day     DATE, -- ngày sinh (YYYY-MM-DD)
    bio           TEXT, -- giới thiệu bản thân
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- thời gian tạo profile
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- thời gian cập nhật profile
    CONSTRAINT fk_up_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE user_statistics (
    user_id             BIGINT PRIMARY KEY, -- FK -> users.id
    total_sessions      INTEGER DEFAULT 0, -- tổng số session game đã chơi
    total_questions     INTEGER DEFAULT 0, -- tổng số câu hỏi đã làm
    total_correct       INTEGER DEFAULT 0, -- tổng số câu trả lời đúng
    total_time_seconds  INTEGER DEFAULT 0, -- tổng thời gian chơi (giây)
    last_played_at      TIMESTAMP, -- thời gian chơi gần nhất
    CONSTRAINT fk_us_user
        FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE user_word_statistics (
    user_id          BIGINT NOT NULL, -- FK -> users.id
    word_id          BIGINT NOT NULL, -- FK -> words.id
    correct_count    INTEGER DEFAULT 0, -- số lần trả lời đúng từ này
    wrong_count      INTEGER DEFAULT 0, -- số lần trả lời sai từ này
    last_answered_at TIMESTAMP, -- lần gần nhất trả lời từ này
    streak           INTEGER DEFAULT 0, -- chuỗi đúng liên tiếp cho từ này
    PRIMARY KEY (user_id, word_id),
    CONSTRAINT fk_uws_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_uws_word
        FOREIGN KEY (word_id) REFERENCES words(id)
);

CREATE TABLE user_topic_statistics (
    user_id         BIGINT NOT NULL, -- FK -> users.id
    topic_id        BIGINT NOT NULL, -- FK -> topics.id
    total_questions INTEGER DEFAULT 0, -- tổng câu hỏi theo topic
    total_correct   INTEGER DEFAULT 0, -- tổng câu đúng theo topic
    last_played_at  TIMESTAMP, -- lần chơi topic này gần nhất
    PRIMARY KEY (user_id, topic_id),
    CONSTRAINT fk_uts_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_uts_topic
        FOREIGN KEY (topic_id) REFERENCES topics(id)
);

CREATE TABLE vocab_game_sessions (
    id                  BIGSERIAL PRIMARY KEY, -- id session game
    user_id             BIGINT NOT NULL, -- FK -> users.id
    mode                VARCHAR(50) NOT NULL, -- chế độ: 'level', 'topic', ...
    source_language_id  SMALLINT NOT NULL, -- FK -> languages.id (ngôn ngữ câu hỏi)
    target_language_id  SMALLINT NOT NULL, -- FK -> languages.id (ngôn ngữ đáp án)
    topic_id            BIGINT, -- FK -> topics.id (nếu chơi theo topic)
    level_id            BIGINT, -- FK -> levels.id (nếu chơi theo level)
    total_questions     SMALLINT DEFAULT 0, -- tổng số câu hỏi trong session
    correct_questions   SMALLINT DEFAULT 0, -- tổng số câu trả lời đúng
    started_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- thời gian bắt đầu
    ended_at            TIMESTAMP, -- thời gian kết thúc
    CONSTRAINT fk_vgs_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_vgs_source_lang
        FOREIGN KEY (source_language_id) REFERENCES languages(id),
    CONSTRAINT fk_vgs_target_lang
        FOREIGN KEY (target_language_id) REFERENCES languages(id),
    CONSTRAINT fk_vgs_topic
        FOREIGN KEY (topic_id) REFERENCES topics(id),
    CONSTRAINT fk_vgs_level
        FOREIGN KEY (level_id) REFERENCES levels(id)
);

CREATE INDEX idx_vgs_user_time ON vocab_game_sessions(user_id, started_at);

CREATE TABLE vocab_game_questions (
    id                     BIGSERIAL PRIMARY KEY, -- id câu hỏi game
    session_id             BIGINT NOT NULL, -- FK -> vocab_game_sessions.id
    question_order         SMALLINT NOT NULL, -- thứ tự câu trong session
    question_type          VARCHAR(30) NOT NULL, -- loại câu: 'word_to_translation', ...
    source_word_id         BIGINT NOT NULL, -- FK -> words.id (từ nguồn)
    source_sense_id        BIGINT, -- FK -> senses.id (nghĩa cụ thể, nếu dùng)
    correct_target_word_id BIGINT NOT NULL, -- FK -> words.id (đáp án đúng)
    source_language_id     SMALLINT NOT NULL, -- FK -> languages.id (ngôn ngữ câu hỏi)
    target_language_id     SMALLINT NOT NULL, -- FK -> languages.id (ngôn ngữ đáp án)
    created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- thời gian tạo câu hỏi
    CONSTRAINT fk_vgq_session
        FOREIGN KEY (session_id) REFERENCES vocab_game_sessions(id),
    CONSTRAINT fk_vgq_source_word
        FOREIGN KEY (source_word_id) REFERENCES words(id),
    CONSTRAINT fk_vgq_source_sense
        FOREIGN KEY (source_sense_id) REFERENCES senses(id),
    CONSTRAINT fk_vgq_correct_word
        FOREIGN KEY (correct_target_word_id) REFERENCES words(id),
    CONSTRAINT fk_vgq_source_lang
        FOREIGN KEY (source_language_id) REFERENCES languages(id),
    CONSTRAINT fk_vgq_target_lang
        FOREIGN KEY (target_language_id) REFERENCES languages(id)
);

CREATE INDEX idx_vgq_session_order ON vocab_game_questions(session_id, question_order);

CREATE TABLE vocab_game_question_options (
    id             BIGSERIAL PRIMARY KEY, -- id phương án lựa chọn
    question_id    BIGINT NOT NULL, -- FK -> vocab_game_questions.id
    option_label   CHAR(1) NOT NULL, -- nhãn: 'A', 'B', 'C', 'D'
    target_word_id BIGINT NOT NULL, -- FK -> words.id (từ hiển thị làm lựa chọn)
    is_correct     BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE nếu là đáp án đúng
    CONSTRAINT fk_vgqo_question
        FOREIGN KEY (question_id) REFERENCES vocab_game_questions(id),
    CONSTRAINT fk_vgqo_target_word
        FOREIGN KEY (target_word_id) REFERENCES words(id),
    UNIQUE (question_id, option_label) -- mỗi câu chỉ có 1 A/B/C/D
);

CREATE TABLE vocab_game_question_answers (
    id                 BIGSERIAL PRIMARY KEY, -- id câu trả lời
    question_id        BIGINT NOT NULL, -- FK -> vocab_game_questions.id
    session_id         BIGINT NOT NULL, -- FK -> vocab_game_sessions.id
    user_id            BIGINT NOT NULL, -- FK -> users.id
    selected_option_id BIGINT, -- FK -> vocab_game_question_options.id (đáp án user chọn)
    is_correct         BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE nếu trả lời đúng
    response_time_ms   INTEGER, -- thời gian trả lời (ms)
    answered_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- thời gian trả lời
    CONSTRAINT fk_vgqa_question
        FOREIGN KEY (question_id) REFERENCES vocab_game_questions(id),
    CONSTRAINT fk_vgqa_session
        FOREIGN KEY (session_id) REFERENCES vocab_game_sessions(id),
    CONSTRAINT fk_vgqa_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_vgqa_option
        FOREIGN KEY (selected_option_id) REFERENCES vocab_game_question_options(id)
);

CREATE INDEX idx_vgqa_user_time ON vocab_game_question_answers(user_id, answered_at);

-- Create function and trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_words_updated_at BEFORE UPDATE ON words
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
