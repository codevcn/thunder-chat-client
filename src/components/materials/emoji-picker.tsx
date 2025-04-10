type TEmojiPickerProps = {
   onSelectEmoji: (emoji: EmojiClickData) => void
   emojiStyle: EmojiStyle
   searchPlaceholder: string
}

const EmojiPicker = ({ emojiStyle, onSelectEmoji, searchPlaceholder }: TEmojiPickerProps) => {
   return (
      <Picke
         onEmojiClick={onSelectEmoji}
         previewConfig={{ showPreview: false }}
         lazyLoadEmojis
         emojiStyle={emojiStyle}
         searchPlaceholder={searchPlaceholder}
      />
   )
}

export default EmojiPicker
