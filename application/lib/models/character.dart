class Character {
  Character({
    required this.id,
    required this.name,
    required this.description,
    required this.avatar,
    required this.temperament,
    required this.worldId,
  });

  factory Character.fromJson(Map<String, dynamic> json) {
    final personality = json['personality'] as Map<String, dynamic>?;
    return Character(
      id: json['_id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      avatar: json['avatar'] as String?,
      temperament: personality?['temperament'] as String?,
      worldId: json['worldId'] as String?,
    );
  }

  final String id;
  final String name;
  final String description;
  final String? avatar;
  final String? temperament;
  final String? worldId;
}
