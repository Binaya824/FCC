enum MessageRole { user, assistant, system }

MessageRole _roleFromJson(String value) {
  switch (value) {
    case 'user':
      return MessageRole.user;
    case 'assistant':
      return MessageRole.assistant;
    default:
      return MessageRole.system;
  }
}

class ChatMessage {
  ChatMessage({
    required this.id,
    required this.role,
    required this.content,
    required this.createdAt,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['_id'] as String,
      role: _roleFromJson(json['role'] as String),
      content: json['content'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  final String id;
  final MessageRole role;
  final String content;
  final DateTime createdAt;
}
