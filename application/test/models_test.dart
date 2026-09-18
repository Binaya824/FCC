import 'package:flutter_test/flutter_test.dart';

import 'package:fcc_app/models/character.dart';
import 'package:fcc_app/models/chat_message.dart';
import 'package:fcc_app/models/conversation.dart';

void main() {
  test('Character.fromJson parses personality and optional fields', () {
    final character = Character.fromJson({
      '_id': 'c1',
      'name': 'Kavya',
      'description': 'A sultry desert princess.',
      'avatar': null,
      'personality': {'temperament': 'sultry'},
      'worldId': 'w1',
    });

    expect(character.id, 'c1');
    expect(character.name, 'Kavya');
    expect(character.avatar, isNull);
    expect(character.temperament, 'sultry');
    expect(character.worldId, 'w1');
  });

  test('Conversation.fromJson parses required fields', () {
    final conversation = Conversation.fromJson({
      '_id': 'conv1',
      'characterId': 'c1',
      'worldId': 'w1',
      'title': 'Chat with Kavya',
      'updatedAt': '2026-09-18T17:00:00.000Z',
    });

    expect(conversation.id, 'conv1');
    expect(conversation.characterId, 'c1');
    expect(conversation.title, 'Chat with Kavya');
    expect(conversation.updatedAt, DateTime.parse('2026-09-18T17:00:00.000Z'));
  });

  test('ChatMessage.fromJson maps role strings to enum', () {
    final userMessage = ChatMessage.fromJson({
      '_id': 'm1',
      'role': 'user',
      'content': 'hi',
      'createdAt': '2026-09-18T17:00:00.000Z',
    });
    final assistantMessage = ChatMessage.fromJson({
      '_id': 'm2',
      'role': 'assistant',
      'content': 'hello',
      'createdAt': '2026-09-18T17:00:01.000Z',
    });

    expect(userMessage.role, MessageRole.user);
    expect(assistantMessage.role, MessageRole.assistant);
  });
}
