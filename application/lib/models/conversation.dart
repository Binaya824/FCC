class Conversation {
  Conversation({
    required this.id,
    required this.characterId,
    required this.worldId,
    required this.title,
    required this.updatedAt,
  });

  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      id: json['_id'] as String,
      characterId: json['characterId'] as String,
      worldId: json['worldId'] as String?,
      title: json['title'] as String,
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  final String id;
  final String characterId;
  final String? worldId;
  final String title;
  final DateTime updatedAt;
}
